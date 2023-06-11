import { Router } from 'express';

import { UserMiddleware } from '../middlewares';
import { UserController } from '../controllers';

const { remove, get } = UserController,
  userRouter = Router(),
  { inspectDeleteUser } = UserMiddleware;

userRouter.get('/', get);
userRouter.delete('/:userId', inspectDeleteUser, remove);

export default userRouter;
