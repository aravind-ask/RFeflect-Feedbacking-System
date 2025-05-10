export interface IEmailService {
  sendFeedbackRequestEmail(
    to: string,
    requestorName: string,
    message: string,
    link: string
  ): Promise<void>;

  sendFeedbackSubmissionEmail(
    to: string,
    providerName: string,
    qualityScore: number
  ): Promise<void>;

  sendFeedbackRejectionEmail(
    to: string,
    reason: string
  ): Promise<void>;
}
