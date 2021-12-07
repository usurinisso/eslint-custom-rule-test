import { ApiProperty } from '@nestjs/swagger';
import { CreateCart } from 'capabilities/carts';
import { IsNumber } from 'class-validator';

export class CreateCartBody implements CreateCart {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ type: Number, example: [1, 2], isArray: true })
  @IsNumber({}, { each: true })
  baguetteIds: number[];
}
