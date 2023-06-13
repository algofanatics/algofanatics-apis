import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { customAlphabet } from 'nanoid';
import { numbers } from 'nanoid-dictionary';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mailer from '../../utils/mailer';
import User from '../../models/User';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';
import { logger, env } from '../../config';
import { userService } from '../../service';

const { apiResponse } = Toolbox;
const { APP_BASE_URL } = env;

const nanoid = customAlphabet(numbers, 4);

const signUpHTML = fs.readFileSync(path.join(__dirname, '../../templates/signup.html'), {
  encoding: 'utf-8',
});

async function signup(req: Request, res: Response) {
  try {
    const { phoneNumber, email, password, username } = req.body as any;

    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.ALREADY_EXISTS,
        ResponseCode.FAILURE,
        {},
        'User already exists'
      );
    }

    const tempToken = jwt.sign({ email }, process.env.JWT_SECRET as string as string, {
      expiresIn: '7d',
    });
    const redirectUrl = `${APP_BASE_URL}/auth/verify?token=${tempToken}`;

    await User.create({
      phoneNumber,
      password: bcrypt.hashSync(String(password), 10),
      email,
      username,
      expiresIn: new Date(new Date().setDate(new Date().getDate() + 7)),
    });

    logger('redirect url', redirectUrl);
    
    const mailResponse = await mailer(
      email,
      'Verify your account',
      signUpHTML
        .replace('{{username}}', `${username}`)
        .replace('{{LINK}}', redirectUrl)
        .replace('{{DATE}}', `${moment().format('YYYY')}`),
      username
    );

    logger('mail response', mailResponse);

    return apiResponse(
      res,
      ResponseType.SUCCESS,
      StatusCode.OK,
      ResponseCode.SUCCESS,
      {},
      'Registration successful.'
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

export default signup;
