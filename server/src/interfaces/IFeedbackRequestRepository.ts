import { IFeedbackRequest } from '../models/feedbackRequest';

export interface IFeedbackRequestRepository {
  create(request: IFeedbackRequest): Promise<IFeedbackRequest>;
  countByRequestorInPeriod(requestorId: string, days: number): Promise<number>;
  countByProviderInPeriod(
    providerId: string,
    requestorId: string,
    days: number
  ): Promise<number>;
  findByStatus(
    userId: string,
    status: string,
    tenantId: string
  ): Promise<IFeedbackRequest[]>;
  findById(id: string): Promise<IFeedbackRequest | null>;
  update(
    id: string,
    data: Partial<IFeedbackRequest>
  ): Promise<IFeedbackRequest | null>;
}
