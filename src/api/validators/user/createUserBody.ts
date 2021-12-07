import { ApiProperty } from '@nestjs/swagger';
import { CreateUser } from 'capabilities/users';
import { IsString } from 'class-validator';

export class CreateUserBody implements CreateUser {
  @ApiProperty({ type: String, example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, example: 'Snow' })
  @IsString()
  lastName: string;

  @ApiProperty({ type: String, example: 'elma99' })
  @IsString()
  userName: string;

  @ApiProperty({ type: String, example: 'Secret' })
  @IsString()
  password: string;
}
