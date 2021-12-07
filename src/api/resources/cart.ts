import { ApiProperty } from '@nestjs/swagger';
import { CartWithUserAndBaguettes } from 'models/carts';
import { Baguette } from 'resources/baguette';
import { User } from 'resources/user';

export class Cart {
  @ApiProperty({ type: Number, example: 1 })
  id: number;

  @ApiProperty({ type: Baguette, isArray: true })
  baguettes?: Baguette[];

  @ApiProperty({ type: User })
  user?: User;

  constructor(id: number, baguettes: Baguette[], user: User) {
    this.id = id;
    this.baguettes = baguettes;
    this.user = user;
  }

  public static from(cart: CartWithUserAndBaguettes): Cart {
    return new Cart(cart.id, cart.baguettes, cart.user);
  }
}
