import { IUser } from '../models/User';

export interface IUserRepository {
  findById(id: string): Promise<IUser | null>;
  findByTenantId(tenantId: string): Promise<IUser[]>;
}
