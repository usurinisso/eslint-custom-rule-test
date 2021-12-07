import { Logger } from '@nestjs/common';
import { CreateShop, Shops, UpdateShop } from 'capabilities/shops';
import { FullShop } from 'models/shops';

export class ShopService {
  constructor(private readonly shops: Shops) {}
  private readonly logger = new Logger();

  async deleteShop(id: number): Promise<void> {
    this.logger.debug('Service deleteShop() id - ' + id);

    await this.shops.deleteEntity(id);
  }

  async updateShop(id: number, shop: UpdateShop): Promise<FullShop> {
    this.logger.debug('Service updateShop() id - ' + id, shop);

    return await this.shops.updateEntity(id, shop);
  }

  async createShop(shop: CreateShop): Promise<FullShop> {
    this.logger.debug('Service createShop()');

    return await this.shops.createEntity(shop);
  }

  async findOneShop(id: number): Promise<FullShop> {
    this.logger.debug('Service findOneShop() id - ' + id);
    return await this.shops.findOneEntity(id);
  }

  async findAllShops(): Promise<FullShop[]> {
    this.logger.debug('Service findAllShops()');

    return await this.shops.findAllEntities();
  }
}
