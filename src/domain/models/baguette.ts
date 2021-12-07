import { Cart } from 'infrastructure/persistence/entities/cart.entity';
import { Order } from 'infrastructure/persistence/entities/order.entity';
import { Shop } from 'infrastructure/persistence/entities/shop.entity';
import { DateTime } from 'luxon';
import { FullCart } from 'models/carts';
import { FullOrder } from 'models/orders';
import { FullShop } from 'models/shops';
import { BaguetteCondition } from 'types/baguetteCondition';
import { BaguetteType } from 'types/baguetteType';

export interface FullBaguette {
  id: number;

  price: number;

  sizeCm: number;

  type: BaguetteType;

  description: string;

  condition: BaguetteCondition;

  bakedAt: DateTime;
}

export interface BaguetteWithCarts extends FullBaguette {
  carts?: FullCart[];
}

export interface BaguetteWithShop extends FullBaguette {
  shop: FullShop;
}

export interface BaguetteWithOrder extends FullBaguette {
  order?: FullOrder;
}

export type BaguetteWithCartsAndShopAndOrder = BaguetteWithCarts & BaguetteWithShop & BaguetteWithOrder;
