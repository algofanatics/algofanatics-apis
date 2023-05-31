import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      const status = exception.getStatus();
      const message = 'Bad request';
      response.status(status).json({ statusCode: status, message });
    } else if (exception instanceof UnauthorizedException) {
      const status = exception.getStatus();
      const message = 'Unauthorized';
      response.status(status).json({ statusCode: status, message });
    } else if (exception instanceof NotFoundException) {
      const status = exception.getStatus();
      const message = 'Resource not found';
      response.status(status).json({ statusCode: status, message });
    } else {
      throw exception; //to other service layer
    }
  }
}
