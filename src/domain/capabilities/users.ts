import { FullUser, UserWithCartAndOrders } from 'models/users';

export interface Users {
  findOneEntity(id: number): Promise<UserWithCartAndOrders>;

  createEntity(createEntity: CreateUser): Promise<FullUser>;

  findAllEntities(): Promise<FullUser[]>;

  deleteEntity(id: number): Promise<void>;

  updateEntity(id: number, updateEntity: UpdateUser): Promise<FullUser>;

  findOneEntityByName(username: string): Promise<UserWithCartAndOrders>;
}

export interface CreateUser {
  firstName: string;

  lastName: string;

  userName: string;

  password: string;
}

export interface UpdateUser {
  password: string;
}
