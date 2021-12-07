import { CallHandler, ExecutionContext, UseInterceptors } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';
import { catchError, Observable, throwError } from 'rxjs';

import { ApiErrorFilter } from './api-error-filter';
import { AppError } from './app-error';

export function ErrorStatus(From: Type<AppError>, statusCode: ErrorHttpStatusCode): MethodDecorator {
  return UseInterceptors({
    intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
      return next.handle().pipe(
        catchError((error) => {
          if (error instanceof From) {
            Reflect.defineMetadata(ApiErrorFilter.STATUS_CODE_META_DATA, statusCode, From);
          }

          return throwError(() => error);
        }),
      );
    },
  });
}
