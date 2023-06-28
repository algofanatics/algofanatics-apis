import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { ResponseCode, ResponseType } from '../@types';
import { ApiError, StatusCode, Toolbox } from '../utils';

const { apiResponse } = Toolbox;

const Authentications = {
  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      const authToken = req.headers.authorization;
      if (!authToken)
        throw new ApiError(
          'Authentications',
          'Not authorized',
          'authenticate',
          StatusCode.UNAUTHORIZED
        );
      const tokenString = authToken.split('Bearer')[1].trim();
      if (!tokenString)
        throw new ApiError(
          'Authentications',
          'No token in header',
          'authenticate',
          StatusCode.UNAUTHORIZED
        );
      const decoded: any = jwt.verify(tokenString, process.env.JWT_SECRET as string);
      const user = await User.findById(decoded?.id).exec();

      if (!decoded || !user)
        throw new ApiError(
          'Authentications',
          'Invalid token',
          'authenticate',
          StatusCode.UNAUTHORIZED
        );
      if (user.isDeleted.status)
        throw new ApiError(
          'Authentications',
          'This account has been deleted. Please contact support',
          'authenticate',
          StatusCode.UNAUTHORIZED
        );
      req.user = user;
      next();
    } catch (error: any) {
      return apiResponse(
        res,
        ResponseType.FAILURE,
        StatusCode.UNAUTHORIZED,
        ResponseCode.FAILURE,
        error.message as string
      );
    }
  },
};

export default Authentications;
