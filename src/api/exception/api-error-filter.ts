import { ArgumentsHost, Catch, ExceptionFilter, HttpException, InternalServerErrorException } from '@nestjs/common';
import { ErrorHttpStatusCode, HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

import { AppError } from './app-error';

type ErrorResponse = { statusCode: number; message: string | string[]; error: string };

@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const httpException = ApiErrorFilter.getHttpError(exception);
    const errorResponse = httpException.getResponse() as ErrorResponse;
    const errorCode = exception instanceof AppError ? exception?.code : undefined;

    host
      .switchToHttp()
      .getResponse()
      .status(errorResponse.statusCode)
      .json({
        error: {
          name: exception.constructor.name,
          message: errorResponse.error ?? errorResponse.message,
          status: errorResponse.statusCode,
          faults: Array.isArray(errorResponse.message) ? errorResponse.message : [errorResponse.message],
          code: errorCode,
        },
      });
  }

  static STATUS_CODE_META_DATA = 'ApiErrorFilter:StatusCode';

  private static getHttpError(exception: Error): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (Reflect.hasMetadata(ApiErrorFilter.STATUS_CODE_META_DATA, exception.constructor)) {
      const statusCode: ErrorHttpStatusCode = Reflect.getMetadata(
        ApiErrorFilter.STATUS_CODE_META_DATA,
        exception.constructor,
      );

      return new HttpErrorByCode[statusCode](exception.message) as HttpException;
    }

    const error = new InternalServerErrorException(exception.message);
    error.stack = exception.stack;
    return error;
  }
}
