import { BaguetteWithShop } from 'models/baguette';
import { FullOrder, OrderWithBaguettes, OrderWithBaguettesAndUser, OrderWithUser } from 'models/orders';
import { FullUser } from 'models/users';

export interface Orders {
  findAllEntities(): Promise<OrderWithUser[]>;

  findOneEntity(id: number): Promise<OrderWithBaguettesAndUser>;

  createEntity(createEntity: CreateOrder, baguettes: BaguetteWithShop[], user: FullUser): Promise<OrderWithBaguettes>;

  updateEntity(id: number, updateEntity: UpdateOrder): Promise<FullOrder>;

  deleteEntity(id: number): Promise<void>;

  findAllEntitiesByUser(id: number): Promise<FullOrder[]>;
}

export interface CreateOrder {
  userId: number;

  deliveryAddress: string;

  deliveryInfo: string;

  baguetteIds: number[];
}

export interface UpdateOrder {
  deliveryAddress?: string;

  deliveryInfo?: string;

  delivered?: boolean;
}
