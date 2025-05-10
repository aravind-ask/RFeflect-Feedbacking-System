import { Schema, model } from 'mongoose';

export interface IFeedback {
  _id?: string;
  requestId?: string;
  receiverId: string;
  providerId: string;
  formId: string;
  responses: { fieldName: string; value: any }[];
  qualityScore: number;
  isAnonymous: boolean;
  submittedAt: Date;
  recalledAt?: Date;
  tenantId: string;
}

const feedbackSchema = new Schema<IFeedback>({
  requestId: { type: String },
  receiverId: { type: String, required: true },
  providerId: { type: String, required: true },
  formId: { type: String, required: true },
  responses: [{ fieldName: String, value: Schema.Types.Mixed }],
  qualityScore: { type: Number, required: true },
  isAnonymous: { type: Boolean, default: false },
  submittedAt: { type: Date, required: true },
  recalledAt: { type: Date },
  tenantId: { type: String, required: true },
});

export const Feedback = model<IFeedback>('Feedback', feedbackSchema);
