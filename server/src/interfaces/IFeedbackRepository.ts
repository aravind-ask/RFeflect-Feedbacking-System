import { IFeedback } from '../models/feedback';

export interface IFeedbackRepository {
  create(feedback: IFeedback): Promise<IFeedback>;
  findById(id: string): Promise<IFeedback | null>;
  update(id: string, data: Partial<IFeedback>): Promise<IFeedback | null>;
  findByReceiverId(receiverId: string, tenantId: string): Promise<IFeedback[]>;
}
