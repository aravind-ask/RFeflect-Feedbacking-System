import { Request, Response } from 'express';
import { IUserRepository } from '../interfaces/IUserRepository';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/responses';

export class UserController {
  constructor(private userRepository: IUserRepository) {}

  async getUsers(req: AuthRequest, res: Response) {
    try {
      const tenantId = req.user!.tenantId;
      const users = await this.userRepository.findByTenantId(tenantId);
      const filteredUsers = users.filter((user) => user._id !== req.user!._id);
      return res
        .status(200)
        .json(successResponse(filteredUsers, 'Users fetched'));
    } catch (error) {
      return res
        .status(500)
        .json(errorResponse('SERVER_ERROR', 'Internal server error'));
    }
  }
}
