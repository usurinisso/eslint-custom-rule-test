import { CreateOrder, Orders, UpdateOrder } from 'capabilities/orders';
import { OrderNotFoundError } from 'exceptions/order-not-found';
import { Order } from 'infrastructure/persistence/entities/order.entity';
import { BaguetteWithShop } from 'models/baguette';
import { FullOrder, OrderWithBaguettes, OrderWithBaguettesAndUser, OrderWithUser } from 'models/orders';
import { FullUser } from 'models/users';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> implements Orders {
  async findOneEntity(id: number): Promise<OrderWithBaguettesAndUser> {
    const entity = await this.findOne({ where: { id }, relations: ['baguettes'] });

    if (!entity) {
      throw new OrderNotFoundError();
    }

    return entity as unknown as OrderWithBaguettesAndUser;
  }

  async createEntity(
    createEntity: CreateOrder,
    baguettes: BaguetteWithShop[],
    user: FullUser,
  ): Promise<OrderWithBaguettes> {
    const price = baguettes.map((x) => x.price).reduce((a, b) => Number(a) + Number(b));
    return (await this.save(
      new Order(createEntity.deliveryAddress, createEntity.deliveryInfo, price, user, baguettes),
    )) as unknown as OrderWithBaguettes;
  }

  async findAllEntities(): Promise<OrderWithUser[]> {
    return (await this.find({ relations: ['user'] })) as unknown as OrderWithUser[];
  }

  async findAllEntitiesByUser(id: number): Promise<FullOrder[]> {
    console.log(id);
    return (await this.find({ where: { user: { id } } })) as unknown as FullOrder[];
  }

  async updateEntity(id: number, updateEntity: UpdateOrder): Promise<FullOrder> {
    const entityToUpdate = await this.findOne(id);

    if (!entityToUpdate) {
      throw new OrderNotFoundError();
    }

    entityToUpdate.deliveryAddress = updateEntity.deliveryAddress ?? entityToUpdate.deliveryAddress;
    entityToUpdate.delivered = updateEntity.delivered ?? entityToUpdate.delivered;
    entityToUpdate.deliveryInfo = updateEntity.deliveryInfo ?? entityToUpdate.deliveryInfo;

    await this.save(entityToUpdate);

    return await this.findOne(id);
  }

  async deleteEntity(id: number): Promise<void> {
    const { baguettes, ...entityToDelete } = await this.findOne(id);

    if (!entityToDelete) {
      throw new OrderNotFoundError();
    }

    await this.remove(entityToDelete);
  }
}
