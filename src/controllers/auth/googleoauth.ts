import { Request, Response } from 'express';
import googleOauthService from '../../service/googleoauth';
import jwt from 'jsonwebtoken';
import { userService } from '../../service';
import User from '../../models/user.model';
import { StatusCode, Toolbox } from '../../utils';
import { ResponseType, ResponseCode } from '../../@types';

const { apiResponse } = Toolbox;

class googleAuth {
  private authService: googleOauthService;
  constructor(redirectUrl: string) {
    this.authService = new googleOauthService(redirectUrl);
  }

  public getAuthUrl(req: Request, res: Response): void {
    const authUrl = this.authService.generateAuthUrl();
    console.log(authUrl, 'authUrl');
    res.redirect(authUrl);
  }

  public async signUp(req: Request, res: Response) {
    const { code } = req.query;
    try {
      const user = await this.authService.getUserInfo(code as string);

      const existingUser = await userService.getUserByEmail(user.email);

      if (existingUser) {
        const token = jwt.sign(
          { id: existingUser._id },
          process.env.JWT_SECRET as string as string,
          {
            expiresIn: '1d',
          }
        );
        const existingUserJSON = existingUser.toObject();
        const { password, _id, ...others } = existingUserJSON;

        return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
          ...others,
          token,
        });
      }

      const newUser = await User.create({
        email: user.email,
        username: user.username,
        isActive: true,
      });

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET as string as string, {
        expiresIn: '1d',
      });
      const newUserJSON = newUser.toObject();
      const { password, _id, ...others } = newUserJSON;

      return apiResponse(res, ResponseType.SUCCESS, StatusCode.OK, ResponseCode.SUCCESS, {
        ...others,
        token,
      });
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
}

export default googleAuth;
