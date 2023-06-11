import { UserService } from '../services';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import Tools, { APIError } from '../utils';
import { HTTP_STATUS_CODES } from '../@types';
import { getReasonPhrase } from 'http-status-codes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sendConfirmationMail } = require('../mailer/sendConfirmationMail');

const { getEncryptedPassword, getDecryptedPassword, errorResponse, successResponse, apiResponse, createToken } = Tools;

class Auth {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async signUp(req: Request, res: Response) {
    try {
      const { username, firstName, lastName, email, password } = req.body;

      const user = await UserService.find({ email }, res);

      if (user)
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'Email already exists', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.BAD_REQUEST
        );

      const userName = await UserService.find({ username }, res);

      if (userName)
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'username already exists', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.BAD_REQUEST
        );

      const hashedPassword = await getEncryptedPassword(password),
        code: string = uuidv4();

      const newUser = await UserService.create(
        {
          username,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          status: 'pending',
          confirmationCode: `weeja-${code}`,
        },
        res
      );

      newUser?.save(async (error: any) => {
        if (error) {
          await UserService.remove({ email: req.body.email }, res);
          return apiResponse(
            res,
            errorResponse('send', 'controllers/message', 'Some error occurred', JSON.stringify(':-(')),
            HTTP_STATUS_CODES.NOT_FOUND
          );
        }

        const response: any = await sendConfirmationMail({
          confirmationCode: newUser.confirmationCode,
          toEmail: newUser.email,
          fullName: `${newUser.firstName as string} ${newUser.lastName as string}`,
        });

        if (response.success) {
          return apiResponse(
            res,
            successResponse(
              'get',
              'controllers/messages',
              getReasonPhrase(HTTP_STATUS_CODES.OK),
              JSON.stringify('user created successfully. please check your email to verify your account')
            ),
            HTTP_STATUS_CODES.OK
          );
        } else {
          await UserService.remove({ email: req.body.email }, res);
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
      });
    } catch (error) {
      await UserService.remove({ email: req.body.email }, res);
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

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserService.find({ email }, res);
      if (!user)
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'user not found', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );

      // Decrypt the user password and compare
      const validPassword = await getDecryptedPassword(password, user);

      if (!validPassword)
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'user is not authorized', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.UNAUTHORIZED
        );

      const token = createToken(email);

      res.cookie('token', token, { maxAge: 3600 * 1000, httpOnly: true }); //1 hour

      return apiResponse(
        res,
        successResponse('get', 'controllers/messages', getReasonPhrase(HTTP_STATUS_CODES.OK), JSON.stringify('login successful')),
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

  async verifyEmail(req: Request, res: Response) {
    try {
      const { confirmationCode } = req.params;

      // Check if the user already exist in the database
      const user = await UserService.find({ confirmationCode }, res);
      if (!user)
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'code is not valid', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );
      if (user.status === 'active')
        return apiResponse(
          res,
          errorResponse('send', 'controllers/message', 'user is already verified', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );

      user.status = 'active';
      await user.save();

      return apiResponse(
        res,
        successResponse(
          'get',
          'controllers/messages',
          getReasonPhrase(HTTP_STATUS_CODES.OK),
          JSON.stringify('account confirmed')
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
}

export default new Auth();
