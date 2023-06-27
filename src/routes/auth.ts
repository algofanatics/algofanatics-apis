import express from 'express';
import { AuthController } from '../controllers';
import { UserMiddleware, BlogMiddleware } from '../middleware';
import { env } from '../config';

const production = env.NODE_ENV === 'PRODUCTION';

const signUpRedirectUri = production ? env.PROD_SIGNUP_REDIRECT_URI : env.DEV_SIGNUP_REDIRECT_URI;
console.log(signUpRedirectUri, 'signUpRedirectUri');

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

const signupAuth = new googleAuth(signUpRedirectUri as string);

router.post('/signup', inspectRegisterUser, signup);
router.post('/login', inspectAuthRoutes, login);
router.post('/token', inspectAuthRoutes, genToken);
router.post('/password', inspectAuthRoutes, newPassword);
router.post('/login/resend', inspectAuthRoutes, resendEmail);
router.get('/verify', inspectVerifyToken, verifyToken);
router.patch('/status', inspectToggleActivationStatus, softDeleteUser);
router.get('/me/:id', getUser);
router.get('/blog', BlogMiddleware.inspectBlogQuery, getBlogs);
router.get('/gg', signupAuth.getAuthUrl.bind(signupAuth));
router.get('/gg/callback', signupAuth.signUp.bind(signupAuth));

export default router;
