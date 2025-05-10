import { IFeedbackRequestRepository } from '../interfaces/IFeedbackRequestRepository';
import { IFeedbackRequest, FeedbackRequest } from '../models/feedbackRequest';

export class FeedbackRequestMongoRepository
  implements IFeedbackRequestRepository
{
  async create(request: IFeedbackRequest): Promise<IFeedbackRequest> {
    return FeedbackRequest.create(request);
  }

  async countByRequestorInPeriod(
    requestorId: string,
    days: number
  ): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return FeedbackRequest.countDocuments({
      requestorId,
      createdAt: { $gte: startDate },
    });
  }

  async countByProviderInPeriod(
    providerId: string,
    requestorId: string,
    days: number
  ): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return FeedbackRequest.countDocuments({
      providerId,
      requestorId,
      createdAt: { $gte: startDate },
    });
  }

  async findByStatus(
    userId: string,
    status: string,
    tenantId: string
  ): Promise<IFeedbackRequest[]> {
    return FeedbackRequest.find({
      $or: [{ requestorId: userId }, { providerId: userId }],
      status,
      tenantId,
    });
  }

  async findById(id: string): Promise<IFeedbackRequest | null> {
    return FeedbackRequest.findById(id);
  }

  async update(
    id: string,
    data: Partial<IFeedbackRequest>
  ): Promise<IFeedbackRequest | null> {
    return FeedbackRequest.findByIdAndUpdate(id, data, { new: true });
  }
}
