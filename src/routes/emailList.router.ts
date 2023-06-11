import { Router } from 'express';

import { UserMiddleware } from '../middlewares';
import { UserController } from '../controllers';

const { addEmail } = UserController,
  emailListRouter = Router(),
  { inspectEmailList } = UserMiddleware;

emailListRouter.post('/add', inspectEmailList, addEmail);

export default emailListRouter;
