import { HTTP_STATUS_CODES } from '../@types';

export default class BaseError extends Error {
  public readonly log: string;
  public readonly methodName!: string;
  public readonly httpCode: HTTP_STATUS_CODES;
  public readonly isOperational: boolean;
  constructor(
    log: string,
    message: string | unknown = log,
    methodName?: string,
    httpCode = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message as string);
    Object.setPrototypeOf(this, new.target.prototype);

    this.log = log;
    if (methodName) this.methodName = methodName;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}
