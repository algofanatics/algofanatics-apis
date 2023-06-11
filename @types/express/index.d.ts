import { IUserType } from '../../source/utils/interface';

type email = string;

declare global {
  namespace Express {
    interface Request {
      user?: IUserType;
    }
  }
}
