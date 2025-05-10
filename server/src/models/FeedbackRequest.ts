import { Schema, model } from 'mongoose';

export interface IFeedbackRequest {
  _id?: string;
  requestorId: string;
  providerId: string;
  message: string;
  expectedDate: Date;
  status: string;
  declineReason?: string;
  createdAt: Date;
  tenantId: string;
}

const feedbackRequestSchema = new Schema<IFeedbackRequest>({
  requestorId: { type: String, required: true },
  providerId: { type: String, required: true },
  message: { type: String, required: true },
  expectedDate: { type: Date, required: true },
  status: { type: String, required: true, default: 'Pending' },
  declineReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  tenantId: { type: String, required: true },
});

export const FeedbackRequest = model<IFeedbackRequest>(
  'FeedbackRequest',
  feedbackRequestSchema
);
