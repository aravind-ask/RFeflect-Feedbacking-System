export interface IFeedback {
  _id: string;
  requestId?: string;
  receiverId: string;
  providerId: string;
  formId: string;
  responses: { fieldName: string; value: any }[];
  qualityScore: number;
  isAnonymous: boolean;
  submittedAt: string;
  recalledAt?: string;
  tenantId: string;
}
