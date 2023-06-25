import genToken from './genToken';
import login from './login';
import newPassword from './newPassword';
import resendEmail from './resendEmail';
import signup from './signup';
import verifyToken from './verifyToken';
import softDeleteUser from './softDeleteUser';
import getUser from './getUser';
import getBlogs from './getBlogs';

const AuthController = {
  genToken,
  login,
  newPassword,
  resendEmail,
  signup,
  verifyToken,
  softDeleteUser,
  getUser,
  getBlogs
};

export default AuthController;
