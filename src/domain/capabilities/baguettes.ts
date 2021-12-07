import { BaguetteWithShop, FullBaguette } from 'models/baguette';
import { FullShop } from 'models/shops';
import { BaguetteCondition } from 'types/baguetteCondition';
import { BaguetteType } from 'types/baguetteType';
import { CreateBaguetteBody } from 'validators/baguette/createBaguetteBody';
import { UpdateBaguetteBody } from 'validators/baguette/updateBaguetteBody';

export interface Baguettes {
  findAllEntities(shop: FullShop): Promise<FullBaguette[]>;

  findOneEntity(shop: FullShop, id: number): Promise<FullBaguette>;

  createEntity(shop: FullShop, baguette: CreateBaguetteBody): Promise<FullBaguette>;

  updateEntity(shop: FullShop, id: number | number[], baguette: UpdateBaguetteBody): Promise<FullBaguette>;

  deleteEntity(shop: FullShop, id: number): Promise<void>;

  findManyByIds(ids: number[]): Promise<BaguetteWithShop[]>;
}

export interface CreateBaguette {
  price: number;

  sizeCm: number;

  description: string;

  type: BaguetteType;

  condition: BaguetteCondition;
}

export interface UpdateBaguette {
  price?: number;

  sizeCm?: number;

  description?: string;

  type?: BaguetteType;

  condition?: BaguetteCondition;
}
