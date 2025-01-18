import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status: number =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse: string | object =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const message: string =
      typeof errorResponse === 'string' ? errorResponse : (errorResponse as any).message;

    response.status(status).json({
      success: false,
      statusCode: status,
      message: message || 'An error occurred',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
