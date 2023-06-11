import { Router } from 'express';

import { AuthenticatorMiddleware } from '../middlewares';

import AuthRouter from './auth.router';
import UserRouter from './user.router';
import PasswordRouter from './password.router';
import EmailListRouter from './emailList.router';

const api = Router(),
  { authenticate } = AuthenticatorMiddleware;

api.use('/auth', AuthRouter);
api.use('/list', EmailListRouter);
api.use('/user', authenticate, UserRouter);
api.use('/password', authenticate, PasswordRouter);

export default api;
