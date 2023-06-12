import { Request, Response } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import mailer from '../../utils/mailer';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { env } from '../../config';
import { Toolbox } from '../../utils';

const { apiResponse } = Toolbox;
const { APP_BASE_URL } = env;

const verifyHtml = fs.readFileSync(path.join(__dirname, '/../../templates/signup.html'), {
  encoding: 'utf-8',
});

async function resendEmail(req: Request, res: Response) {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.NOT_FOUND,
        ResponseCode.FAILURE,
        {},
        'User not found.'
      );
    }
    console.log(user.isActive);
    if (!user?.isActive) {
      user.expiresIn = new Date(new Date().setDate(new Date().getDate() + 7));
      await user.save();

      const tempToken = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET as string, {
        expiresIn: '7d',
      });

      const redirectUrl = `${APP_BASE_URL}/auth/verify?token=${tempToken}`;

      await mailer(
        req.body.email,
        'Verify your Algofanatics account',
        verifyHtml
          .replace(`{{NAME}}`, `${user.firstName}`)
          .replace('{{LINK}}', redirectUrl.toString())
      );
      return apiResponse(
        res,
        ResponseType.SUCCESS,
        StatusCode.OK,
        ResponseCode.SUCCESS,
        {},
        'Email sent.'
      );
    }
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.ALREADY_EXISTS,
      ResponseCode.FAILURE,
      {},
      'This user is already verified.'
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

export default resendEmail;
