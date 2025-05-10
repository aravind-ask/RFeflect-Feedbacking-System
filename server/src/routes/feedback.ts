import express from 'express';
import { FeedbackRequestController } from '../controllers/FeedbackRequestController';
import { FeedbackController } from '../controllers/FeedbackController';
import { UserMongoRepository } from '../repositories/UserMongoRepository';
import { FeedbackRequestMongoRepository } from '../repositories/FeedbackRequestMongoRepository';
import { FeedbackMongoRepository } from '../repositories/FeedbackMongoRepository';
import { FeedbackRequestService } from '../services/FeedbackRequestService';
import { FeedbackService } from '../services/FeedbackService';
import { EmailService } from '../services/EmailService';
import { authenticate, restrictTo } from '../middleware/auth';

const router = express.Router();

const userRepo = new UserMongoRepository();
const feedbackRequestRepo = new FeedbackRequestMongoRepository();
const feedbackRepo = new FeedbackMongoRepository();
const emailService = new EmailService();
const feedbackRequestService = new FeedbackRequestService(
  feedbackRequestRepo,
  userRepo,
  emailService
);
const feedbackService = new FeedbackService(
  feedbackRepo,
  feedbackRequestRepo,
  emailService
);
const feedbackRequestController = new FeedbackRequestController(
  feedbackRequestService
);
const feedbackController = new FeedbackController(feedbackService);

router.post(
  '/request',
  authenticate,
  restrictTo('Requestor', 'Manager', 'HR'),
  feedbackRequestController.createRequest.bind(feedbackRequestController)
);

router.get(
  '/requests',
  authenticate,
  feedbackRequestController.getRequestsByStatus.bind(feedbackRequestController)
);

router.post(
  '/reminder',
  authenticate,
  restrictTo('Requestor', 'Manager', 'HR'),
  feedbackRequestController.sendReminder.bind(feedbackRequestController)
);

router.post(
  '/submit',
  authenticate,
  restrictTo('FeedbackProvider'),
  feedbackController.submitFeedback.bind(feedbackController)
);

router.post(
  '/reject',
  authenticate,
  restrictTo('FeedbackProvider'),
  feedbackController.rejectFeedback.bind(feedbackController)
);

router.post(
  '/recall',
  authenticate,
  restrictTo('FeedbackProvider'),
  feedbackController.recallFeedback.bind(feedbackController)
);

router.get(
  '/received',
  authenticate,
  feedbackController.getReceivedFeedback.bind(feedbackController)
);

export default router;
