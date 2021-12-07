import { ApiProperty } from '@nestjs/swagger';

export class HttpError {
  @ApiProperty({ example: 'InternalServerException' })
  readonly name: string;

  @ApiProperty({ example: 500 })
  readonly status: number;

  @ApiProperty({ type: String, required: false, example: 'E00000' })
  readonly code?: number;

  @ApiProperty({ type: String, isArray: true, example: 'error message' })
  readonly message: string;

  @ApiProperty({ type: String, isArray: true, example: ['cause of a failure'] })
  readonly faults: string[];

  constructor(name: string, status: number, message: string, code: number, faults?: string[]) {
    this.name = name;
    this.status = status;
    this.code = code;
    this.message = message;
    this.faults = faults || [];
  }
}
