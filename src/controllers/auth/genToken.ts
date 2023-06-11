import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { customAlphabet } from 'nanoid';
import { numbers } from 'nanoid-dictionary';
import mailer from '../../utils/mailer';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';

const { apiResponse } = Toolbox;

const nanoid = customAlphabet(numbers, 6);

const resetBody = fs.readFileSync(path.join(__dirname, '/../../templates/user.html'), {
  encoding: 'utf-8',
});

async function genToken(req: Request, res: Response) {
  try {
    const tempToken = nanoid();

    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { tempToken },
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
    await mailer(
      req.body.email,
      'Password Reset',
      resetBody
        .replace(`{{TOKEN}}`, `${tempToken}`)
        .replace('{{TITLE}}', 'This is your password reset token')
    );
    return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, { tempToken });
  } catch (error: any) {
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.INTERNAL_SERVER_ERROR,
      ResponseCode.FAILURE,
      {},
      `looks like something went wrong: ${JSON.stringify(
        error.response ? error.response.data : error
      )} `
    );
  }
}

export default genToken;
