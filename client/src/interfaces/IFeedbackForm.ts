export interface IFeedbackForm {
  _id: string;
  fields: {
    name: string;
    type: string;
    options?: string[];
    required: boolean;
  }[];
  effectiveDate: string;
  createdBy: string;
  tenantId: string;
}
