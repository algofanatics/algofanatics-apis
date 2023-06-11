import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';

import Tools, { APIError } from '../utils';
import { UserService } from '../services';
import { IJwtPayload } from '../@types/interface';
import { AuthAPIValidations } from '../validations';
import { HTTP_STATUS_CODES } from '../@types';
import { getReasonPhrase } from 'http-status-codes';

const { apiResponse, errorResponse, verifyToken, checkToken } = Tools;

class Authenticator {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async authenticate(req: Request | any, res: Response, next: NextFunction) {
    try {
      const token = checkToken(req);
      if (!token || token === 'Bearer' || token === undefined) {
        return apiResponse(
          res,
          errorResponse('authenticate', getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST), 'Invalid or missing token'),
          HTTP_STATUS_CODES.BAD_REQUEST
        );
      }

      const tokenData = verifyToken(token);

      if (tokenData === 'Invalid Token') {
        return apiResponse(
          res,
          errorResponse('authenticate', getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST), 'Invalid Token'),
          HTTP_STATUS_CODES.BAD_REQUEST
        );
      }
      req.user = tokenData;
      const { email } = tokenData;
      const user = await UserService.find({ email }, res);
      const selected = _.pick(user, ['_id', 'firstName', 'lastName', 'email']);
      req.user = selected as IJwtPayload;
      next();
    } catch (error: any) {
      const response = error instanceof APIError ? error.message : 'Access Denied. Invalid Token';
      return apiResponse(
        res,
        errorResponse(
          'authenticate',
          getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
  }

  async inspectLogin(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthAPIValidations.validateLogin(req.body);
      next();
    } catch (error: any) {
      const response = error instanceof APIError ? error.message : 'Check your email or password';
      return apiResponse(
        res,
        errorResponse(
          'authenticate',
          getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
  }

  async inspectSignup(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthAPIValidations.validateSignup(req.body);
      next();
    } catch (error: any) {
      const response = error instanceof APIError ? error.message : 'invalid input';
      return apiResponse(
        res,
        errorResponse(
          'authenticate',
          getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
  }

  async inspectVerifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthAPIValidations.validateVerifyEmail(req.params);
      next();
    } catch (error: any) {
      const response = error instanceof APIError ? error.message : 'invalid input';
      return apiResponse(
        res,
        errorResponse(
          'authenticate',
          getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
  }
}

export default Authenticator;
