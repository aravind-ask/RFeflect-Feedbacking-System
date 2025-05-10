import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/errors';
import { IUser } from '../models/User';
import { RBACSettings } from '../models/RBACSettings';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IUser;
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
};

export const restrictTo = (...roles: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    const rbac = await RBACSettings.findOne({ tenantId: req.user.tenantId });
    if (!rbac) {
      throw new UnauthorizedError('RBAC settings not found');
    }

    const userRole = rbac.roles.find((r) => r.role === req.user!.role);
    if (!userRole || !roles.includes(req.user!.role)) {
      throw new UnauthorizedError('Access denied');
    }

    next();
  };
};
