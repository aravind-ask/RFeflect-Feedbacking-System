import { IFeedbackRepository } from '../interfaces/IFeedbackRepository';
import { IFeedback, Feedback } from '../models/feedback';

export class FeedbackMongoRepository implements IFeedbackRepository {
  async create(feedback: IFeedback): Promise<IFeedback> {
    return Feedback.create(feedback);
  }

  async findById(id: string): Promise<IFeedback | null> {
    return Feedback.findById(id);
  }

  async update(
    id: string,
    data: Partial<IFeedback>
  ): Promise<IFeedback | null> {
    return Feedback.findByIdAndUpdate(id, data, { new: true });
  }

  async findByReceiverId(
    receiverId: string,
    tenantId: string
  ): Promise<IFeedback[]> {
    return Feedback.find({
      receiverId,
      tenantId,
      recalledAt: { $exists: false },
    });
  }
}
