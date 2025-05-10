import { Request, Response } from 'express';
import { z } from 'zod';
import { IFeedbackRequestService } from '../interfaces/IFeedbackRequestService';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/responses';
import { AppError } from '../utils/errors';

const requestSchema = z.object({
  providerId: z.string(),
  message: z.string().min(1),
  expectedDate: z.string().transform((val) => new Date(val)),
});

const statusSchema = z.object({
  status: z.enum(['Pending', 'Completed', 'Expired', 'Rejected']),
});

const reminderSchema = z.object({
  requestId: z.string(),
});

export class FeedbackRequestController {
  constructor(private feedbackRequestService: IFeedbackRequestService) {}

  async createRequest(req: AuthRequest, res: Response) {
    try {
      const { providerId, message, expectedDate } = requestSchema.parse(
        req.body
      );
      const requestorId = req.user!._id;
      const tenantId = req.user!.tenantId;

      const request = await this.feedbackRequestService.createRequest(
        requestorId,
        providerId,
        message,
        expectedDate,
        tenantId
      );

      return res
        .status(201)
        .json(successResponse(request, 'Feedback request created'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json(
            errorResponse('VALIDATION_ERROR', 'Invalid input', error.errors)
          );
      }
      if (error instanceof AppError) {
        return res
          .status(error.status)
          .json(errorResponse(error.code, error.message));
      }
      return res
        .status(500)
        .json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  }

  async getRequestsByStatus(req: AuthRequest, res: Response) {
    try {
      const { status } = statusSchema.parse(req.query);
      const userId = req.user!._id;
      const tenantId = req.user!.tenantId;

      const requests = await this.feedbackRequestService.getRequestsByStatus(
        userId,
        status,
        tenantId
      );

      return res
        .status(200)
        .json(successResponse(requests, 'Requests fetched'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json(
            errorResponse('VALIDATION_ERROR', 'Invalid input', error.errors)
          );
      }
      if (error instanceof AppError) {
        return res
          .status(error.status)
          .json(errorResponse(error.code, error.message));
      }
      return res
        .status(500)
        .json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  }

  async sendReminder(req: AuthRequest, res: Response) {
    try {
      const { requestId } = reminderSchema.parse(req.body);
      const userId = req.user!._id;
      const tenantId = req.user!.tenantId;

      await this.feedbackRequestService.sendReminder(
        requestId,
        userId,
        tenantId
      );

      return res.status(200).json(successResponse(null, 'Reminder sent'));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json(
            errorResponse('VALIDATION_ERROR', 'Invalid input', error.errors)
          );
      }
      if (error instanceof AppError) {
        return res
          .status(error.status)
          .json(errorResponse(error.code, error.message));
      }
      return res
        .status(500)
        .json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  }
}
