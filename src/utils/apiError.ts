import { HTTP_STATUS_CODES } from '../@types';
import BaseError from './baseError';

export default class APIError extends BaseError {
  constructor(message: string, methodName = '', httpCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, isOperational = true) {
    super('', message, methodName, httpCode, isOperational);
  }
}
