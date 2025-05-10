import { Schema, model } from 'mongoose';

export interface IUser {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  role: string; // Requestor, FeedbackProvider, Manager, HR, Admin
  tenantId: string;
}

const userSchema = new Schema<IUser>({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  tenantId: { type: String, required: true },
});

export const User = model<IUser>('User', userSchema);
