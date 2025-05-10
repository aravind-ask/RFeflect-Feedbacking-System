import express from 'express';
import { UserController } from '../controllers/UserController';
import { UserMongoRepository } from '../repositories/UserMongoRepository';
import { authenticate } from '../middleware/auth';

const router = express.Router();

const userRepo = new UserMongoRepository();
const userController = new UserController(userRepo);

router.get('/', authenticate, userController.getUsers.bind(userController));

export default router;
