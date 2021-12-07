import { ApiProperty } from '@nestjs/swagger';
import { UpdateCart } from 'capabilities/carts';
import { IsNumber } from 'class-validator';

export class UpdateCartBody implements UpdateCart {
  @ApiProperty({ type: Number, example: [1, 2], isArray: true })
  @IsNumber({}, { each: true })
  baguetteIds: number[];
}
