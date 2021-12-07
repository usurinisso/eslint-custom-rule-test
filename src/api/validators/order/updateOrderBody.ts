import { ApiProperty } from '@nestjs/swagger';
import { UpdateOrder } from 'capabilities/orders';
import { IsBoolean, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateOrderBody implements UpdateOrder {
  @ApiProperty({ type: String, example: 'Vilniaus g. 35 - 71, Kaunas' })
  @ValidateIf((o) => 'deliveryAddress' in o)
  @IsString()
  @IsOptional()
  deliveryAddress?: string;

  @ApiProperty({ type: String, example: 'Leave in front of the door' })
  @ValidateIf((o) => 'deliveryInfo' in o)
  @IsString()
  @IsOptional()
  deliveryInfo?: string;

  @ApiProperty({ type: Boolean, example: true })
  @ValidateIf((o) => 'delivered' in o)
  @IsBoolean()
  @IsOptional()
  delivered?: boolean;
}
