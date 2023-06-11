import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODES } from '../@types';
import { getReasonPhrase } from 'http-status-codes';

import Tools, { APIError } from '../utils';
import { UserAPIValidations } from '../validations';

const { apiResponse, errorResponse } = Tools;

class User {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async inspectDeleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await UserAPIValidations.validateDeleteUser(req.params);
      next();
    } catch (error) {
      const response = error instanceof APIError ? error.message : 'Invalid input';
      return apiResponse(
        res,
        errorResponse(
          'user',
          getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
  }

  async inspectEmailList(req: Request, res: Response, next: NextFunction) {
    try {
      await UserAPIValidations.validateEmailList(req.body);
      next();
    } catch (error) {
      const response = error instanceof APIError ? error.message : 'Invalid input';
      return apiResponse(
        res,
        errorResponse(
          'user',
          getReasonPhrase(HTTP_STATUS_CODES.BAD_REQUEST),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.BAD_REQUEST
      );
    }
  }
}

export default User;
