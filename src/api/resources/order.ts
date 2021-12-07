import { ApiProperty } from '@nestjs/swagger';
import { OrderWithBaguettesAndUser } from 'models/orders';
import { Baguette } from 'resources/baguette';
import { User } from 'resources/user';

export class Order {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: String, example: 'Vilniaus g. 35 - 71, Kaunas' })
  deliveryAddress: string;

  @ApiProperty({ type: String, example: 'Leave in front of the door' })
  deliveryInfo: string;

  @ApiProperty({ type: Baguette, isArray: true })
  baguettes?: Baguette[];

  @ApiProperty({ type: User })
  user?: User;

  @ApiProperty({ type: Boolean, example: true })
  delivered: boolean;

  @ApiProperty({ type: Number, example: 36.99 })
  price: number;

  constructor(
    id: number,
    deliveryAddress: string,
    deliveryInfo: string,
    delivered: boolean,
    price: number,
    baguettes?: Baguette[],
    user?: User,
  ) {
    this.id = id;
    this.deliveryAddress = deliveryAddress;
    this.deliveryInfo = deliveryInfo;
    this.delivered = delivered;
    this.price = price;
    this.baguettes = baguettes;
    this.user = user;
  }

  public static from(order: OrderWithBaguettesAndUser): Order {
    return new Order(
      order.id,
      order.deliveryAddress,
      order.deliveryInfo,
      order.delivered,
      order.price,
      order.baguettes,
      order.user,
    );
  }
}
