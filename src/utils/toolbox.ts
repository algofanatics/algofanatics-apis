import { Response, Request } from 'express';
import moment from 'moment';
import { parse } from 'js2xmlparser';
import { getReasonPhrase } from 'http-status-codes';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUserType } from '../@types/interface';
import { env, logger } from '../configs';
import { applicationJsonType, applicationXmlType, APIResponseType, HTTP_STATUS_CODES } from '../@types';

/**
 * Function for api tools methods
 * @function Toolbox
 */
class Tools {
  args: any[];
  constructor(...args: undefined[]) {
    this.args = args;
  }

  createToken(email: string, expiresIn: string = '1h'): string {
    const payload = { email };

    const token = jwt.sign(payload, env.SESSION_SECRET as string, { expiresIn });

    return token;
  }

  verifyToken(token: string): any {
    return jwt.verify(token, env.SESSION_SECRET as string, (err) => {
      if (err) {
        console.error(err);
        const response: string = 'Invalid Token';

        return response;
      }
      const response = jwt.verify(token, env.SESSION_SECRET as string) as JwtPayload;

      return response;
    });
  }

  checkToken(req: Request) {
    const {
      headers: { authorization },
      cookies: { token: cookieToken },
    } = req;
    let bearerToken = null;
    if (authorization) {
      bearerToken = authorization.split(' ')[1] ? authorization.split(' ')[1] : authorization;
    }
    return cookieToken || bearerToken || req.headers['x-access-token'] || req.headers.token || req.body.token;
  }

  async getEncryptedPassword(key: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(key, salt);

    return hashedPassword;
  }

  async getDecryptedPassword(password: string, user: IUserType): Promise<boolean> {
    const decryptedPassword = await bcrypt.compare(password, user.password as string);

    return decryptedPassword;
  }

  getRandomNumber(): string {
    const randomNumber = crypto.randomBytes(64).toString('hex');

    return randomNumber;
  }
  /**Always JSON.stringify data */
  successResponse(nameOfRoute: string, nameOfLogFile: string, responseMessage: string, data: string): APIResponseType {
    logger(`tracking exceptions on ${nameOfRoute}`, `${nameOfLogFile}/${moment().format('DD-MM-YYYY')}`).log({
      level: 'info',
      message: JSON.parse(data),
    });
    return {
      status: 'success',
      responseCode: '00',
      responseMessage,
      details: JSON.parse(data),
    };
  }

  errorResponse(
    nameOfRoute: string,
    nameOfLogDirectory: string,
    responseMessage = 'Some error occurred while processing request.',
    data: string
  ): APIResponseType {
    logger(`tracking exceptions in ${nameOfRoute}`, `${nameOfLogDirectory}/${moment().format('DD-MM-YYYY')}`).log({
      level: 'error',
      message: data,
    });
    return {
      status: 'fail',
      responseCode: '01',
      responseMessage,
      details: responseMessage === 'Internal Server' ? 'Some error occurred while processing request.' : JSON.parse(data),
    };
  }

  apiResponse = (res: Response, data: APIResponseType, statusCode: number, rootElement = ''): Response => {
    return res.format({
      json: () => {
        res.type(applicationJsonType);
        res.status(statusCode).send(data);
      },
      xml: () => {
        res.type(applicationXmlType);
        res.status(statusCode).send(parse(rootElement || '', data));
      },
      default: () => {
        res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).send(getReasonPhrase(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR));
      },
    });
  };
}

export default Tools;
