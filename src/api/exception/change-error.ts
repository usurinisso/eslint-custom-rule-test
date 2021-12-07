import { CallHandler, ExecutionContext, UseInterceptors } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { catchError, Observable, throwError } from 'rxjs';

export function ChangeError(From: Type<Error>, To: Type<Error>): MethodDecorator {
  return UseInterceptors({
    intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
      return next.handle().pipe(
        catchError((error) => {
          return throwError(() => (error instanceof From ? new To(error.message) : error));
        }),
      );
    },
  });
}
