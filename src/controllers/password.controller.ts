import { UserService, PasswordResetTokenService } from '../services';
import crypto from 'crypto';
import { Request, Response } from 'express';

import Tools from '../utils';
import { IPasswordResetToken } from '../@types/interface';
import { getReasonPhrase } from 'http-status-codes';
import { HTTP_STATUS_CODES } from '../@types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sendPasswordResetTokenMail } = require('../mailer/sendPasswordResetTokenMail');

const { apiResponse, errorResponse, successResponse, getEncryptedPassword, getDecryptedPassword } = Tools;

class Password {
  args: (string | undefined)[];
  constructor(...args: (string | undefined)[]) {
    this.args = args;
  }

  async createResetToken(req: Request, res: Response) {
    try {
      const user = await UserService.find({ email: req.body.email }, res);
      if (!user)
        return apiResponse(
          res,
          errorResponse('send', 'This user does not exist', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );
      const resetToken = await PasswordResetTokenService.find({ userId: user._id }, res);

      if (!resetToken) {
        const passwordResetToken = await PasswordResetTokenService.create(
          { userId: user._id, token: crypto.randomBytes(32).toString('hex') },
          res
        );

        passwordResetToken?.save(async (error: any) => {
          if (error) {
            await PasswordResetTokenService.remove({ userId: user._id }, res);
            return apiResponse(
              res,
              errorResponse('send', 'some error occurred', JSON.stringify(':-(')),
              HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
            );
          }
        });

        const response = await sendPasswordResetTokenMail({
          passwordResetToken,
          toEmail: user.email,
          fullName: `${user.firstName as string} ${user.lastName as string}`,
        });

        if (response.success) {
          return apiResponse(
            res,
            successResponse(
              'get',
              getReasonPhrase(HTTP_STATUS_CODES.OK),
              JSON.stringify('token created successfully. check your email')
            ),
            HTTP_STATUS_CODES.OK
          );
        } else {
          await PasswordResetTokenService.remove({ userId: user._id }, res);
          return apiResponse(
            res,
            errorResponse(
              'send',
              'Some error occurred with the mailer',
              JSON.stringify('cannot create token at the moment please contact support team.')
            ),
            HTTP_STATUS_CODES.NOT_FOUND
          );
        }
      } else {
        const { token } = resetToken as IPasswordResetToken;

        const response = await sendPasswordResetTokenMail({
          passwordResetToken: token,
          toEmail: user.email,
          fullName: `${user.firstName as string} ${user.lastName as string}`,
        });

        if (response.success) {
          return apiResponse(
            res,
            successResponse(
              'get',
              getReasonPhrase(HTTP_STATUS_CODES.OK),
              JSON.stringify('token created successfully. please check your mail')
            ),
            HTTP_STATUS_CODES.OK
          );
        } else {
          await PasswordResetTokenService.remove({ userId: user._id }, res);
          return apiResponse(
            res,
            errorResponse(
              'send',
              'Some error occurred with the mailer',
              JSON.stringify('cannot create token at the moment please contact support team.')
            ),
            HTTP_STATUS_CODES.NOT_FOUND
          );
        }
      }
    } catch (error) {
      const response = error instanceof Error ? error.message : error;
      return apiResponse(
        res,
        errorResponse(
          'get',
          getReasonPhrase(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { password, confirmPassword } = req.body;
    try {
      const user = await UserService.find({ userId: req.query.userId as string }, res);
      if (!user)
        return apiResponse(res, errorResponse('send', 'Invalid user access', JSON.stringify(':-(')), HTTP_STATUS_CODES.NOT_FOUND);
      const resetToken = await PasswordResetTokenService.find(
        {
          userId: user._id,
          token: req.query.token as string,
        },
        res
      );
      if (!resetToken)
        return apiResponse(
          res,
          errorResponse('send', 'Invalid or expired link', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );

      if (password !== confirmPassword) {
        return apiResponse(
          res,
          errorResponse('send', 'passwords do not match', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );
      } else {
        const hashedPassword = await getEncryptedPassword(password);
        user.password = hashedPassword;
        await user.save();
        await resetToken.delete();
        return apiResponse(
          res,
          successResponse('get', getReasonPhrase(HTTP_STATUS_CODES.OK), JSON.stringify('password reset successful')),
          HTTP_STATUS_CODES.OK
        );
      }
    } catch (error) {
      const response = error instanceof Error ? error.message : error;
      return apiResponse(
        res,
        errorResponse(
          'get',
          getReasonPhrase(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { oldPassword, newPassword } = req.body;

      const user = await UserService.find({ userId }, res);
      if (!user)
        return apiResponse(res, errorResponse('send', 'User not found', JSON.stringify(':-(')), HTTP_STATUS_CODES.NOT_FOUND);

      const validPassword = await getDecryptedPassword(oldPassword, user);

      if (!validPassword)
        return apiResponse(
          res,
          errorResponse('send', 'user is not authorized', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );

      if (oldPassword !== newPassword)
        return apiResponse(
          res,
          errorResponse('send', 'Passwords do not match', JSON.stringify(':-(')),
          HTTP_STATUS_CODES.NOT_FOUND
        );
      const hashedPassword = await getEncryptedPassword(newPassword);
      user.password = hashedPassword;
      await user.save();
      return apiResponse(
        res,
        successResponse('get', getReasonPhrase(HTTP_STATUS_CODES.OK), JSON.stringify('user password changed successfully')),
        HTTP_STATUS_CODES.OK
      );
    } catch (error) {
      const response = error instanceof Error ? error.message : error;
      return apiResponse(
        res,
        errorResponse(
          'get',
          getReasonPhrase(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR),
          JSON.stringify(response, Object.getOwnPropertyNames(error))
        ),
        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new Password();
