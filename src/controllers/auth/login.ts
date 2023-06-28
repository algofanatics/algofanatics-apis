import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mailer from '../../utils/mailer';
import User from '../../models/user.model';
import { env } from '../../config';
import { ResponseCode, ResponseType, StatusCode } from '../../@types';
import { Toolbox } from '../../utils';

const { apiResponse } = Toolbox;

const { APP_BASE_URL } = env;

// const welcomeHTML = fs.readFileSync(path.join(__dirname, '../../templates/welcome.html'), {
//   encoding: 'utf-8',
// });

const signUpHTML = fs.readFileSync(path.join(__dirname, '../../templates/signup.html'), {
  encoding: 'utf-8',
});

async function login(req: Request, res: Response) {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (!user || !bcrypt.compareSync(String(req.body.password), user.password as string)) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.UNAUTHORIZED,
        ResponseCode.FAILURE,
        {},
        'Invalid credentials'
      );
    }

    // if (user.hasLoggedIn === false && user.isActive) {
    //   try {
    //     await mailer(
    //     req.body.email,
    //     'Welcome To Algofanatics 🤗',
    //     welcomeHTML.replace('{{DATE}}', `${moment().format('YYYY')}`)
    //   );
    //     user.hasLoggedIn = true;
    //     await user.save();
    //   } catch (error) {
    //     req.log.warn(error);
    //   }
    // }

    if (!user?.isActive) {
      if (
        !user.expiresIn ||
        new Date(user.expiresIn).toLocaleDateString('en-CA') <=
          new Date().toLocaleDateString('en-CA')
      ) {
        user.expiresIn = new Date(new Date().setDate(new Date().getDate() + 7));
        await user.save();

        const tempToken = jwt.sign(
          { email: req.body.email },
          process.env.JWT_SECRET as string as string,
          {
            expiresIn: '5m',
          }
        );

        const redirectUrl = `${APP_BASE_URL}/auth/verify?token=${tempToken}`;

        await mailer(
          req.body.email,
          'Verify your account',
          signUpHTML.replace('{{NAME}}', `${user.firstName}`).replace('{{LINK}}', redirectUrl)
        );
      }

      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.UNAUTHORIZED,
        ResponseCode.FAILURE,
        {},
        'Please verify your account by clicking the link we have sent to your email'
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string as string, {
      expiresIn: '1d',
    });
    const userJSON = user.toObject();
    const { password, _id, ...others } = userJSON;

    return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
      ...others,
      token,
    });
  } catch (error: any) {
    return apiResponse(
      res,
      ResponseType.FAILURE,
      StatusCode.INTERNAL_SERVER_ERROR,
      ResponseCode.FAILURE,
      {},
      `looks like something went wrong: ${JSON.stringify(
        error.message || error.response ? error.response.data : error
      )} `
    );
  }
}

export default login;
