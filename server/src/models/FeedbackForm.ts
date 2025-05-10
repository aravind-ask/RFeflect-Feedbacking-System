import { Schema, model } from 'mongoose';

export interface IFeedbackForm {
  _id: string;
  fields: {
    name: string;
    type: string;
    options?: string[];
    required: boolean;
  }[];
  effectiveDate: Date;
  createdBy: string;
  tenantId: string;
}

const feedbackFormSchema = new Schema<IFeedbackForm>({
  fields: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true }, // text, rating, dropdown, date, number
      options: [{ type: String }],
      required: { type: Boolean, default: false },
    },
  ],
  effectiveDate: { type: Date, required: true },
  createdBy: { type: String, required: true },
  tenantId: { type: String, required: true },
});

export const FeedbackForm = model<IFeedbackForm>(
  'FeedbackForm',
  feedbackFormSchema
);
