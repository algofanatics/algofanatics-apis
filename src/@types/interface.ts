import { Document } from 'mongodb';
export interface IUserType extends Document {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  userId?: string;
  status?: string;
  confirmationCode?: string;
}

export interface IPasswordResetToken extends IUserType {
  token?: string;
  createdAt?: string;
}

export interface ILoginInfo {
  email: string;
  password: string;
}

export interface IJwtPayload extends IUserType {
  email: string;
}
