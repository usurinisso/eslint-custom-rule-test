import { FullBaguette } from 'models/baguette';
import { FullUser } from 'models/users';

export interface FullOrder {
  id: number;

  deliveryAddress: string;

  deliveryInfo: string;

  delivered: boolean;

  price: number;
}

export interface OrderWithBaguettes extends FullOrder {
  baguettes?: FullBaguette[];
}

export interface OrderWithUser extends FullOrder {
  user?: FullUser;
}

export type OrderWithBaguettesAndUser = OrderWithBaguettes & OrderWithUser;
