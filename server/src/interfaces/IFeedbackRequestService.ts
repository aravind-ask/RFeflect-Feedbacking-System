import { IFeedbackRequest } from '../models/feedbackRequest';

export interface IFeedbackRequestService {
  createRequest(
    requestorId: string,
    providerId: string,
    message: string,
    expectedDate: Date,
    tenantId: string
  ): Promise<IFeedbackRequest>;
  getRequestsByStatus(
    userId: string,
    status: string,
    tenantId: string
  ): Promise<IFeedbackRequest[]>;
  sendReminder(
    requestId: string,
    userId: string,
    tenantId: string
  ): Promise<void>;
}
