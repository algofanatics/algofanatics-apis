import { Router } from 'express';

import { UserMiddleware } from '../middlewares';
import { PasswordController } from '../controllers';

const { createResetToken } = PasswordController,
  passwordRouter = Router();

passwordRouter.post('/', createResetToken);

export default passwordRouter;
