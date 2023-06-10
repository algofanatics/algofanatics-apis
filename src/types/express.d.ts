import { User } from 'src/schema/user.schema';
declare global {
  namespace Express {
    export interface Request {
      user: any;
    }
  }
}
