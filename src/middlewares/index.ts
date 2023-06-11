import Authenticator from './auth';
import User from './user';

const AuthenticatorMiddleware = new Authenticator();
const UserMiddleware = new User();

export { AuthenticatorMiddleware, UserMiddleware };
