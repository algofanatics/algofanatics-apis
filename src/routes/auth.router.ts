import { Router } from 'express';

import { AuthenticatorMiddleware } from '../middlewares';
import { AuthController } from '../controllers';

const { signUp, login, verifyEmail } = AuthController,
  authRouter = Router(),
  { inspectLogin, inspectSignup, inspectVerifyEmail } = AuthenticatorMiddleware;

authRouter.post('/signup', inspectSignup, signUp);
authRouter.post('/login', inspectLogin, login);
authRouter.get('/vfy/:confirmationCode', inspectVerifyEmail, verifyEmail);

export default authRouter;
