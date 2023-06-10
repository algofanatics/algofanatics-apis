import { Request } from 'express';
import { User } from 'src/schema/user.schema';

export interface ExtendedRequest extends Request {
  user: User;
}
