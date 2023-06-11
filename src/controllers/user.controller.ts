import { UserService } from '../services';
import { Request, Response } from 'express';

import Tools, { APIError } from '../utils';
import { getReasonPhrase } from 'http-status-codes';
import { HTTP_STATUS_CODES } from '../@types';
const { apiResponse, errorResponse, successResponse } = Tools;

class User {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async get(req: Request, res: Response) {
    try {
      const user = await UserService.find({ userId: req.query.userId as string }, res);
      if (!user || user.length == 0)
        return apiResponse(
          res,
          errorResponse(
            'send',
            'controllers/message',
            'User does not exist. You might need to create one.',
            JSON.stringify(':-(')
          ),
          HTTP_STATUS_CODES.NOT_FOUND
        );

      return apiResponse(
        res,
        successResponse(
          'get',
          'controllers/messages',
          getReasonPhrase(HTTP_STATUS_CODES.OK),
          JSON.stringify('users retrieved successfully')
        ),
        HTTP_STATUS_CODES.OK
      );
    } catch (error: any) {
      const response = error instanceof APIError ? error.message : error;
      return apiResponse(
        res,
        errorResponse(
          'addEmail',
          'controllers/user',
          getReasonPhrase(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const deletedUser = await UserService.remove({ userId }, res);

      if (!deletedUser?.deletedCount)
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'User not found', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );

      return apiResponse(
        res,
        successResponse(
          'get',
          'controllers/messages',
          getReasonPhrase(HTTP_STATUS_CODES.OK),
          JSON.stringify('successfully deleted this user')
        ),
        HTTP_STATUS_CODES.OK
      );
    } catch (error: any) {
      const response = error instanceof APIError ? error.message : error;
      return apiResponse(
        res,
        errorResponse(
          'addEmail',
          'controllers/user',
          getReasonPhrase(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addEmail(req: Request, res: Response) {
    try {
      const { email } = req.body;

      /**
       * Check if the email already exists
       */
      const user = await UserService.findOneEmail({ email }, res);

      if (user) {
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'Email already exists', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.CONFLICT
        );
      }

      const addToEmailList = await UserService.addEmailToList({ email }, res);

      await addToEmailList?.save();
      return apiResponse(
        res,
        successResponse('save', 'controllers/addEmail', getReasonPhrase(HTTP_STATUS_CODES.CREATED), JSON.stringify('success')),
        HTTP_STATUS_CODES.CREATED
      );
    } catch (error) {
      const response = error instanceof APIError ? error.message : error;
      return apiResponse(
        res,
        errorResponse(
          'addEmail',
          'controllers/user',
          getReasonPhrase(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new User();
