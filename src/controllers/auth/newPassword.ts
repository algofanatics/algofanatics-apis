import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';

const { apiResponse } = Toolbox;

async function newPassword(req: Request, res: Response) {
  try {
    const { password, tempToken, email } = req.body;
    if (!password)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.BAD_REQUEST,
        ResponseCode.FAILURE,
        {},
        'password is required'
      );
    const user = await User.findOneAndUpdate(
      { email, tempToken },
      { password: bcrypt.hashSync(String(password), 10) },
      { new: true, runValidators: true }
    );
    if (!user)
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.NOT_FOUND,
        ResponseCode.FAILURE,
        {},
        'user with token not found. try to create a token first'
      );

    await User.findOneAndUpdate({ email }, { tempToken: '' }, { new: true, runValidators: true });

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
