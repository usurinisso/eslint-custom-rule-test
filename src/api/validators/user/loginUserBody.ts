import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserBody {
  @ApiProperty({ type: String, example: 'John' })
  @IsString()
  username: string;

  @ApiProperty({ type: String, example: 'Secret' })
  @IsString()
  password: string;
}
