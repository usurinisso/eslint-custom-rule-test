import { ApiProperty } from '@nestjs/swagger';
import { UpdateUser } from 'capabilities/users';
import { IsString } from 'class-validator';

export class UpdateUserBody implements UpdateUser {
  @ApiProperty({ type: String, example: 'BetterSecret99.!' })
  @IsString()
  password: string;
}
