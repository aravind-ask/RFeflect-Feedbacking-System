export interface IEmailService {
  sendFeedbackRequestEmail(
    to: string,
    requestorName: string,
    message: string,
    link: string
  ): Promise<void>;
}
