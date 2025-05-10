export interface IFeedbackRequest {
  _id: string;
  requestorId: string;
  providerId: string;
  message: string;
  expectedDate: string;
  status: string;
  declineReason?: string;
  createdAt: string;
  tenantId: string;
}
