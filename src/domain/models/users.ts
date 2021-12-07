import { FullCart } from 'models/carts';
import { FullOrder } from 'models/orders';
import { RoleType } from 'types/roleType';

export interface FullUser {
  id: number;

  firstName: string;

  lastName: string;

  userName: string;

  password: string;

  role: RoleType;

  hashPassword: () => Promise<void>;
}

export interface UserWithOrders extends FullUser {
  orders?: FullOrder[];
}

export interface UserWithCart extends FullUser {
  cart?: FullCart;
}

export type UserWithCartAndOrders = UserWithCart & UserWithOrders;
