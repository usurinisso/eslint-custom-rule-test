import { ApiProperty } from '@nestjs/swagger';
import { FullShop } from 'models/shops';

export class Shop {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'Vilniaus g. 35 - 71, Kaunas' })
  address: string;

  @ApiProperty({ type: String, example: '+370677772777' })
  phone: string;

  @ApiProperty({ type: String, example: '09:00 - 17:00' })
  workHours: string;

  @ApiProperty({ type: String, example: 'https://cdn.pixabay.com/photo/2013/07/13/11/31/shop-158317_960_720.png' })
  shopImage: string;

  constructor(id: number, address: string, phone: string, workHours: string, shopImage: string) {
    this.id = id;
    this.address = address;
    this.phone = phone;
    this.workHours = workHours;
    this.shopImage = shopImage;
  }

  public static from(shop: FullShop): Shop {
    return new Shop(shop.id, shop.address, shop.phone, shop.workHours, shop.shopImage);
  }
}
