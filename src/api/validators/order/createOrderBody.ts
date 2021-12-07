import { ApiProperty } from '@nestjs/swagger';
import { CreateOrder } from 'capabilities/orders';
import { IsNumber, IsString } from 'class-validator';

export class CreateOrderBody implements CreateOrder {
  @ApiProperty({ type: Number, example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ type: String, example: 'Vilniaus g. 35 - 71, Kaunas' })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ type: String, example: 'Leave in front of the door' })
  @IsString()
  deliveryInfo: string;

  @ApiProperty({ type: Number, example: [1, 2], isArray: true })
  @IsNumber({}, { each: true })
  baguetteIds: number[];
}
