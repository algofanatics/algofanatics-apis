import { Router } from 'express';
import user from './user';
import auth from './auth';
import blog from './blog';

import { AuthenticationsMiddleware } from '../middleware';

const { authenticate } = AuthenticationsMiddleware;
const router = Router();

router.use('/auth', auth);
router.use('/users', authenticate, user);
router.use('/blog', authenticate, blog);

export default router;
