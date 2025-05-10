import nodemailer from 'nodemailer';
import { IEmailService } from '../interfaces/IEmailService';

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendFeedbackRequestEmail(
    to: string,
    requestorName: string,
    message: string,
    link: string
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Feedback Request',
      html: `
        <p>Dear User,</p>
        <p>${requestorName} has requested feedback from you: "${message}"</p>
        <p>Please provide feedback by <a href="${link}">clicking here</a>.</p>
      `,
    });
  }

  async sendFeedbackSubmissionEmail(
    to: string,
    providerName: string,
    qualityScore: number
  ): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Feedback Submitted',
      html: `
        <p>Dear User,</p>
        <p>Feedback has been submitted by ${providerName} with a quality score of ${qualityScore}.</p>
      `,
    });
  }

  async sendFeedbackRejectionEmail(to: string, reason: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Feedback Request Rejected',
      html: `
        <p>Dear User,</p>
        <p>Your feedback request was rejected for the following reason: "${reason}".</p>
      `,
    });
  }
}
