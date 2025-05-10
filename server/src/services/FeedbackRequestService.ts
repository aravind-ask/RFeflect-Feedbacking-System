import { IFeedbackRequestService } from '../interfaces/IFeedbackRequestService';
import { IFeedbackRequestRepository } from '../interfaces/IFeedbackRequestRepository';
import { IEmailService } from '../interfaces/IEmailService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { IFeedbackRequest } from '../models/feedbackRequest';
import { RBACSettings } from '../models/RBACSettings';
import { User } from '../models/User';
import {
  ValidationError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
} from '../utils/errors';

export class FeedbackRequestService implements IFeedbackRequestService {
  constructor(
    private feedbackRequestRepo: IFeedbackRequestRepository,
    private userRepo: IUserRepository,
    private emailService: IEmailService
  ) {}

  async createRequest(
    requestorId: string,
    providerId: string,
    message: string,
    expectedDate: Date,
    tenantId: string
  ): Promise<IFeedbackRequest> {
    if (requestorId === providerId) {
      throw new ValidationError('Cannot request feedback from self');
    }

    const rbac = await RBACSettings.findOne({ tenantId });
    if (!rbac) {
      throw new NotFoundError('RBAC settings not found');
    }

    const totalCount = await this.feedbackRequestRepo.countByRequestorInPeriod(
      requestorId,
      rbac.requestLimits.total.days
    );
    if (totalCount >= rbac.requestLimits.total.count) {
      throw new RateLimitError('Total request limit exceeded');
    }

    const perPersonCount =
      await this.feedbackRequestRepo.countByProviderInPeriod(
        providerId,
        requestorId,
        rbac.requestLimits.perPerson.days
      );
    if (perPersonCount >= rbac.requestLimits.perPerson.count) {
      throw new RateLimitError('Per-person request limit exceeded');
    }

    const provider = await this.userRepo.findById(providerId);
    if (!provider) {
      throw new NotFoundError('Provider not found');
    }

    const request: IFeedbackRequest = {
      requestorId,
      providerId,
      message,
      expectedDate,
      status: 'Pending',
      createdAt: new Date(),
      tenantId,
    };

    const createdRequest = await this.feedbackRequestRepo.create(request);

    const requestor = await this.userRepo.findById(requestorId);
    await this.emailService.sendFeedbackRequestEmail(
      provider.email,
      requestor!.name,
      message,
      `http://localhost:3000/feedback/${createdRequest._id}`
    );

    return createdRequest;
  }

  async getRequestsByStatus(
    userId: string,
    status: string,
    tenantId: string
  ): Promise<IFeedbackRequest[]> {
    const validStatuses = ['Pending', 'Completed', 'Expired', 'Rejected'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status');
    }

    const requests = await this.feedbackRequestRepo.findByStatus(
      userId,
      status,
      tenantId
    );

    // Mark expired requests
    const now = new Date();
    for (const request of requests) {
      if (request.status === 'Pending' && request.expectedDate < now && request._id) {
        await this.feedbackRequestRepo.update(request._id, {
          status: 'Expired',
        });
        request.status = 'Expired';
      }
    }

    return requests;
  }

  async sendReminder(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<void> {
    const request = await this.feedbackRequestRepo.findById(requestId);
    if (!request || request.tenantId !== tenantId) {
      throw new NotFoundError('Feedback request not found');
    }
    if (request.requestorId !== userId) {
      throw new UnauthorizedError('Not authorized to send reminder');
    }
    if (request.status !== 'Pending') {
      throw new ValidationError('Can only send reminders for pending requests');
    }

    const provider = await this.userRepo.findById(request.providerId);
    const requestor = await this.userRepo.findById(request.requestorId);
    if (!provider || !requestor) {
      throw new NotFoundError('User not found');
    }

    await this.emailService.sendFeedbackRequestEmail(
      provider.email,
      requestor.name,
      request.message,
      `http://localhost:3000/feedback/${request._id}`
    );
  }
}
