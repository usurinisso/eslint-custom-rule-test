import { Logger } from '@nestjs/common';
import { Baguettes } from 'capabilities/baguettes';
import { CreateOrder, Orders, UpdateOrder } from 'capabilities/orders';
import { Users } from 'capabilities/users';
import { FullOrder, OrderWithBaguettes, OrderWithBaguettesAndUser, OrderWithUser } from 'models/orders';

export class OrderService {
  constructor(private readonly orders: Orders, private readonly baguettes: Baguettes, private readonly users: Users) {}
  private readonly logger = new Logger();

  async deleteOrder(id: number): Promise<void> {
    this.logger.debug('Service deleteOrder() id - ' + id);

    await this.orders.deleteEntity(id);
  }

  async updateOrder(id: number, order: UpdateOrder): Promise<FullOrder> {
    this.logger.debug('Service updateOrder() id - ' + id, order);

    return await this.orders.updateEntity(id, order);
  }

  async createOrder(order: CreateOrder): Promise<OrderWithBaguettes> {
    this.logger.debug('Service createOrder()');
    const baguettesToOrder = await this.baguettes.findManyByIds(order.baguetteIds);
    const { cart, orders, ...user } = await this.users.findOneEntity(order.userId);

    return await this.orders.createEntity(order, baguettesToOrder, user);
  }

  async findOneOrder(id: number): Promise<OrderWithBaguettesAndUser> {
    this.logger.debug('Service findOneOrder() id - ' + id);
    return await this.orders.findOneEntity(id);
  }

  async findAllOrders(): Promise<OrderWithUser[]> {
    this.logger.debug('Service findAllOrders()');

    return await this.orders.findAllEntities();
  }

  async findAllUserOrders(id: number): Promise<FullOrder[]> {
    this.logger.debug('Service findAllOrders()');

    return await this.orders.findAllEntitiesByUser(id);
  }
}
