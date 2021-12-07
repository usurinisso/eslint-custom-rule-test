import { FullShop } from 'models/shops';

export interface Shops {
  findAllEntities(): Promise<FullShop[]>;

  findOneEntity(shopId: number): Promise<FullShop>;

  createEntity(shop: CreateShop): Promise<FullShop>;

  updateEntity(shopId: number, shop: UpdateShop): Promise<FullShop>;

  deleteEntity(shopId: number): Promise<void>;
}

export interface CreateShop {
  address: string;

  phone: string;

  workHours: string;

  shopImage: string;
}

export interface UpdateShop {
  phone?: string;

  workHours?: string;

  shopImage?: string;
}
