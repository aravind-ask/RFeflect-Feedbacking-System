import { Request, Response } from 'express';
import { z } from 'zod';
import { IFeedbackService } from '../interfaces/IFeedbackService';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/responses';
import { AppError } from '../utils/errors';

const submitSchema = z.object({
  requestId: z.string().optional(),
  receiverId: z.string(),
  formId: z.string(),
  responses: z.array(z.object({ fieldName: z.string(), value: z.any() })),
  isAnonymous: z.boolean(),
});

const rejectSchema = z.object({
  requestId: z.string(),
  reason: z.string().min(1),
});

const recallSchema = z.object({
  feedbackId: z.string(),
});

export class FeedbackController {
  constructor(private feedbackService: IFeedbackService) {}

  async submitFeedback(req: AuthRequest, res: Response) {
    try {
      const { requestId, receiverId, formId, responses, isAnonymous } =
        submitSchema.parse(req.body);
      const providerId = req.user!._id;
      const tenantId = req.user!.tenantId;

      const feedback = await this.feedbackService.submitFeedback(
        requestId,
        receiverId,
        providerId,
        formId,
        responses,
        isAnonymous,
        tenantId
      );

      return res
        .status(201)
        .json(successResponse(feedback, 'Feedback submitted'));
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

  async rejectFeedback(req: AuthRequest, res: Response) {
    try {
      const { requestId, reason } = rejectSchema.parse(req.body);
      const providerId = req.user!._id;
      const tenantId = req.user!.tenantId;

      await this.feedbackService.rejectFeedback(
        requestId,
        providerId,
        reason,
        tenantId
      );

      return res
        .status(200)
        .json(successResponse(null, 'Feedback request rejected'));
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

  async recallFeedback(req: AuthRequest, res: Response) {
    try {
      const { feedbackId } = recallSchema.parse(req.body);
      const providerId = req.user!._id;
      const tenantId = req.user!.tenantId;

      await this.feedbackService.recallFeedback(
        feedbackId,
        providerId,
        tenantId
      );

      return res.status(200).json(successResponse(null, 'Feedback recalled'));
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
