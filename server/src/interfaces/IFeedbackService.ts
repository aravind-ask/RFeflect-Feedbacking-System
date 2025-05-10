import { IFeedback } from '../models/feedback';

export interface IFeedbackService {
  submitFeedback(
    requestId: string | undefined,
    receiverId: string,
    providerId: string,
    formId: string,
    responses: { fieldName: string; value: any }[],
    isAnonymous: boolean,
    tenantId: string
  ): Promise<IFeedback>;
  rejectFeedback(
    requestId: string,
    providerId: string,
    reason: string,
    tenantId: string
  ): Promise<void>;
  recallFeedback(
    feedbackId: string,
    providerId: string,
    tenantId: string
  ): Promise<void>;
  getReceivedFeedback(
    receiverId: string,
    tenantId: string
  ): Promise<IFeedback[]>;
}
