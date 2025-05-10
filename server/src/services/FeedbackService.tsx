import { IFeedbackService } from '../interfaces/IFeedbackService';
import { IFeedbackRepository } from '../interfaces/IFeedbackRepository';
import { IFeedbackRequestRepository } from '../interfaces/IFeedbackRequestRepository';
import { IEmailService } from '../interfaces/IEmailService';
import { IFeedbackForm } from '../models/feedbackForm';
import { IFeedback, Feedback } from '../models/feedback';
import { FeedbackRequest } from '../models/feedbackRequest';
import { RBACSettings } from '../models/RBACSettings';
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors';

export class FeedbackService implements IFeedbackService {
  constructor(
    private feedbackRepo: IFeedbackRepository,
    private feedbackRequestRepo: IFeedbackRequestRepository,
    private emailService: IEmailService,
    private feedbackForm: IFeedbackForm
  ) {}

  private calculateQualityScore(
    responses: { fieldName: string; value: any }[]
  ): number {
    let score = 0;
    responses.forEach((res) => {
      if (typeof res.value === 'string' && res.value.length > 50) score += 30; // Long text responses
      if (typeof res.value === 'number' && res.value >= 4) score += 20; // High ratings
      if (
        typeof res.value === 'string' &&
        res.value.toLowerCase().includes('excellent')
      )
        score += 50; // Keywords
    });
    return Math.min(score, 100); // Cap at 100
  }

  async submitFeedback(
    requestId: string | undefined,
    receiverId: string,
    providerId: string,
    formId: string,
    responses: { fieldName: string; value: any }[],
    isAnonymous: boolean,
    tenantId: string
  ): Promise<IFeedback> {
    const form = await this.feedbackForm.findById(formId);
    if (!form) throw new NotFoundError('Feedback form not found');

    // Validate responses against form fields
    form.fields.forEach((field) => {
      const response = responses.find((r) => r.fieldName === field.name);
      if (field.required && (!response || response.value == null)) {
        throw new ValidationError(`Field ${field.name} is required`);
      }
    });

    const qualityScore = this.calculateQualityScore(responses);

    const feedback: IFeedback = {
      requestId,
      receiverId,
      providerId,
      formId,
      responses,
      qualityScore,
      isAnonymous,
      submittedAt: new Date(),
      tenantId,
    };

    const createdFeedback = await this.feedbackRepo.create(feedback);

    if (requestId) {
      await this.feedbackRequestRepo.update(requestId, { status: 'Completed' });
      const request = await FeedbackRequest.findById(requestId);
      const receiver = await User.findById(receiverId);
      if (request && receiver) {
        await this.emailService.sendFeedbackSubmissionEmail(
          receiver.email,
          isAnonymous
            ? 'Anonymous'
            : (await User.findById(providerId))?.name || 'Unknown',
          qualityScore
        );
      }
    }

    return createdFeedback;
  }

  async rejectFeedback(
    requestId: string,
    providerId: string,
    reason: string,
    tenantId: string
  ): Promise<void> {
    const request = await FeedbackRequest.findOne({
      _id: requestId,
      providerId,
      tenantId,
    });
    if (!request) throw new NotFoundError('Feedback request not found');

    await this.feedbackRequestRepo.update(requestId, {
      status: 'Rejected',
      declineReason: reason,
    });

    const requestor = await User.findById(request.requestorId);
    if (requestor) {
      await this.emailService.sendFeedbackRejectionEmail(
        requestor.email,
        reason
      );
    }
  }

  async recallFeedback(
    feedbackId: string,
    providerId: string,
    tenantId: string
  ): Promise<void> {
    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback || feedback.tenantId !== tenantId)
      throw new NotFoundError('Feedback not found');
    if (feedback.providerId !== providerId)
      throw new UnauthorizedError('Not authorized to recall');

    const rbac = await RBACSettings.findOne({ tenantId });
    if (!rbac) throw new NotFoundError('RBAC settings not found');

    const hoursSinceSubmission =
      (Date.now() - feedback.submittedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceSubmission > rbac.recallTimeframe) {
      throw new ValidationError('Recall timeframe exceeded');
    }

    await this.feedbackRepo.update(feedbackId, { recalledAt: new Date() });
  }
}
