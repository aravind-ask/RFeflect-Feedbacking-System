import { IUserRepository } from '../interfaces/IUserRepository';
import { IUser, User } from '../models/User';

export class UserMongoRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  async findByTenantId(tenantId: string): Promise<IUser[]> {
    return User.find({ tenantId });
  }
}
