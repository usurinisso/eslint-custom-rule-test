import { ApiProperty } from '@nestjs/swagger';
import { CreateShop } from 'capabilities/shops';
import { IsString } from 'class-validator';

export class CreateShopBody implements CreateShop {
  @ApiProperty({ type: String, example: 'Vilniaus g. 35 - 71, Kaunas' })
  @IsString()
  address: string;

  @ApiProperty({ type: String, example: '+370677772777' })
  @IsString()
  phone: string;

  @ApiProperty({ type: String, example: '09:00 - 17:00' })
  @IsString()
  workHours: string;

  @ApiProperty({ type: String, example: 'https://cdn.pixabay.com/photo/2013/07/13/11/31/shop-158317_960_720.png' })
  @IsString()
  shopImage: string;
}
