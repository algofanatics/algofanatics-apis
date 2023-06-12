import { Response } from 'express';
import crypto from 'crypto';
import { parse } from 'js2xmlparser';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { logger } from '../config';
import { applicationJsonType, applicationXmlType, APIResponseType } from '../@types';

/**
 * Function for api tools methods
 * @function Toolbox
 */
class Tools {
  constructor() {}
  apiResponse(
    res: Response,
    ResponseType: number,
    statusCode: number,
    responseCode: string,
    data: string | object,
    responseMessage: string = '',
    rootElement: string | null = ''
  ): Response {
    const status = ResponseType ? 'success' : 'failure';
    const response: APIResponseType = {
      status,
      responseCode: ResponseType ? '00' : responseCode,
      responseMessage: responseMessage || getReasonPhrase(statusCode),
      details: data,
    };
    logger('tracing...', responseMessage || JSON.stringify(data) || 'unknown error');
    return res.format({
      json: () => {
        res.type(applicationJsonType);
        res.status(statusCode).send(response);
      },
      xml: () => {
        res.type(applicationXmlType);
        res.status(statusCode).send(parse(rootElement || 'response', response));
      },
      default: () => {
        res.status(StatusCodes.NOT_IMPLEMENTED).send(getReasonPhrase(StatusCodes.NOT_IMPLEMENTED));
      },
    });
  }

  hashFunc(payload = ''): any {
    return crypto.createHash('sha512').update(payload).digest('hex');
  }
}

export default new Tools();
