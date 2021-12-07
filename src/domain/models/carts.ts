import { FullBaguette } from 'models/baguette';
import { FullUser } from 'models/users';

export interface FullCart {
  id: number;
}

export interface CartWithUser extends FullCart {
  user: FullUser;
}

export interface CartWithBaguettes extends FullCart {
  baguettes?: FullBaguette[];
}

export type CartWithUserAndBaguettes = CartWithUser & CartWithBaguettes;
