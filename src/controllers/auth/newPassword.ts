import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { ApiError, Toolbox } from '../../utils';

const { apiResponse } = Toolbox;

async function newPassword(req: Request, res: Response) {
  try {
    const { pin, tempToken, email } = req.body;
    if (!pin) throw new Error('Please include pin');
    const user = await User.findOneAndUpdate(
      { email, tempToken },
      { pin: bcrypt.hashSync(String(pin), 10) },
      { new: true, runValidators: true }
    );
    if (!user)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.NOT_FOUND,
        ResponseCode.FAILURE,
        {},
        'user not found'
      );

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      {},
      'Password reset successful'
    );
  } catch (error) {
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.INTERNAL_SERVER_ERROR,
      ResponseCode.FAILURE,
      {},
      `looks like something went wrong: ${JSON.stringify(error)} `
    );
  }
}

export default newPassword;
