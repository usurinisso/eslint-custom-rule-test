import { CreateUser, UpdateUser, Users } from 'capabilities/users';
import { UserNotFoundError } from 'exceptions/user-not-found';
import { User } from 'infrastructure/persistence/entities/user.entity';
import { FullUser, UserWithCartAndOrders } from 'models/users';
import { EntityRepository, Repository } from 'typeorm';
import { RoleType } from 'types/roleType';

@EntityRepository(User)
export class UserRepository extends Repository<User> implements Users {
  async findOneEntity(id: number): Promise<UserWithCartAndOrders> {
    const entity = await this.findOne({ where: { id }, relations: ['cart', 'orders'] });

    if (!entity) {
      throw new UserNotFoundError();
    }

    return entity as unknown as UserWithCartAndOrders;
  }

  async findOneEntityByName(username: string): Promise<UserWithCartAndOrders> {
    const entity = await this.findOne({ where: { userName: username }, relations: ['cart', 'orders'] });

    if (!entity) {
      throw new UserNotFoundError();
    }

    return entity as unknown as UserWithCartAndOrders;
  }

  async createEntity(createEntity: CreateUser): Promise<FullUser> {
    return (await this.save(
      new User(createEntity.firstName, createEntity.lastName, createEntity.userName, createEntity.password),
    )) as unknown as FullUser;
  }

  async findAllEntities(): Promise<FullUser[]> {
    return (await this.find()) as unknown as FullUser[];
  }

  async updateEntity(id: number, updateEntity: UpdateUser): Promise<FullUser> {
    const entityToUpdate = await this.findOne(id);

    if (!entityToUpdate) {
      throw new UserNotFoundError();
    }

    entityToUpdate.password = updateEntity.password ?? entityToUpdate.password;

    await this.save(entityToUpdate);

    return await this.findOne(id);
  }

  async deleteEntity(id: number): Promise<void> {
    const entityToDelete = await this.findOne(id);

    if (!entityToDelete) {
      throw new UserNotFoundError();
    }

    await this.delete(id);
  }
}
