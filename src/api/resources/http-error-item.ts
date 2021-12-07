import { ApiProperty } from '@nestjs/swagger';

import { HttpError } from './http-error';

export class HttpErrorItem {
  @ApiProperty({ type: HttpError })
  readonly error: HttpError;

  constructor(error: HttpError) {
    this.error = error;
  }

  static from(error: HttpError): HttpErrorItem {
    return new HttpErrorItem(error);
  }
}
