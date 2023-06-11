import express from 'express';
import { AuthController } from '../controllers';
import { UserMiddleware } from '../middleware';

const router = express.Router();

const { signup, getUser, login, genToken, newPassword, verifyToken, resendEmail, softDeleteUser } =
  AuthController;
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

export default router;
