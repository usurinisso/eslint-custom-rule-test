import { ApiProperty } from '@nestjs/swagger';
import { UpdateShop } from 'capabilities/shops';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateShopBody implements UpdateShop {
  @ApiProperty({ type: String, example: '+370677772777' })
  @ValidateIf((o) => 'phone' in o)
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ type: String, example: '09:00 - 17:00' })
  @ValidateIf((o) => 'workHours' in o)
  @IsString()
  @IsOptional()
  workHours?: string;

  @ApiProperty({ type: String, example: 'https://cdn.pixabay.com/photo/2013/07/13/11/31/shop-158317_960_720.png' })
  @ValidateIf((o) => 'shopImage' in o)
  @IsString()
  @IsOptional()
  shopImage?: string;
}
