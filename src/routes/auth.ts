import express from 'express';
import { AuthController } from '../controllers';
import { UserMiddleware, BlogMiddleware } from '../middleware';

const router = express.Router();

const {
  signup,
  getUser,
  login,
  genToken,
  newPassword,
  verifyToken,
  resendEmail,
  softDeleteUser,
  getBlogs,
  googleAuth,
} = AuthController;
const {
  inspectRegisterUser,
  inspectAuthRoutes,
  inspectVerifyToken,
  inspectToggleActivationStatus,
} = UserMiddleware;

router.post('/signup', inspectRegisterUser, signup);
router.post('/login', inspectAuthRoutes, login);
router.post('/token', inspectAuthRoutes, genToken);
router.post('/password', inspectAuthRoutes, newPassword);
router.post('/login/resend', inspectAuthRoutes, resendEmail);
router.get('/verify', inspectVerifyToken, verifyToken);
router.patch('/status', inspectToggleActivationStatus, softDeleteUser);
router.get('/me/:id', getUser);
router.get('/blog', BlogMiddleware.inspectBlogQuery, getBlogs);
router.get('/gg', googleAuth.getAuthUrl.bind(googleAuth));
router.get('/gg/signup', googleAuth.signUp.bind(googleAuth));
router.get('/gg/signin', googleAuth.signUp.bind(googleAuth));

export default router;
