import { BaguetteWithShop } from 'models/baguette';
import { CartWithUser, CartWithUserAndBaguettes, FullCart } from 'models/carts';
import { FullUser } from 'models/users';

export interface Carts {
  findOneEntity(id: number): Promise<CartWithUserAndBaguettes>;

  createEntity(
    createEntity: CreateCart,
    baguettes: BaguetteWithShop[],
    user: FullUser,
  ): Promise<CartWithUserAndBaguettes>;

  findAllEntities(): Promise<CartWithUser[]>;

  findAllEntitiesByUser(id: number): Promise<FullCart[]>;

  updateEntity(id: number, baguettes: BaguetteWithShop[]): Promise<CartWithUserAndBaguettes>;

  deleteEntity(id: number): Promise<void>;
}

export interface CreateCart {
  userId: number;

  baguetteIds: number[];
}

export interface UpdateCart {
  baguetteIds: number[];
}
