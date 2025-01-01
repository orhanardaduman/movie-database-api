import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidationError } from 'class-validator';

/**
 * Global exception filter that catches and processes all unhandled exceptions
 * in the application, providing a consistent error response format
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Catches and handles exceptions thrown by the application
   * @param exception - The caught exception object
   * @param host - ArgumentsHost object containing the current execution context
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // Get HTTP-specific objects from the execution context
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determine appropriate HTTP status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract error message from exception
    let message = 'Internal server error';
    let validationErrors = undefined;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (
        typeof exceptionResponse === 'object' &&
        'message' in exceptionResponse
      ) {
        const messageValue = exceptionResponse['message'];
        if (
          Array.isArray(messageValue) &&
          messageValue.length > 0 &&
          messageValue[0] instanceof ValidationError
        ) {
          validationErrors = messageValue;
          message = 'Validation failed';
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    }

    // Return formatted error response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      ...(validationErrors && { errors: validationErrors }),
    });
  }
}
