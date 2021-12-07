import { Logger } from '@nestjs/common';
import { Baguettes, CreateBaguette, UpdateBaguette } from 'capabilities/baguettes';
import { FullBaguette } from 'models/baguette';
import { ShopService } from 'services/shop';

export class BaguetteService {
  constructor(private readonly baguettes: Baguettes, private readonly shops: ShopService) {}
  private readonly logger = new Logger();

  async deleteBaguette(shopId: number, id: number): Promise<void> {
    this.logger.debug('Service deleteBaguette() id - ' + id);
    const shop = await this.shops.findOneShop(shopId);

    await this.baguettes.deleteEntity(shop, id);
  }

  async updateBaguette(shopId: number, id: number | number[], baguette: UpdateBaguette): Promise<FullBaguette> {
    this.logger.debug('Service updateBaguette() id - ' + id, baguette);
    const shop = await this.shops.findOneShop(shopId);

    return await this.baguettes.updateEntity(shop, id, baguette);
  }

  async createBaguette(shopId: number, baguette: CreateBaguette): Promise<FullBaguette> {
    this.logger.debug('Service createBaguette()');
    const shop = await this.shops.findOneShop(shopId);

    return await this.baguettes.createEntity(shop, baguette);
  }

  async findOneBaguette(shopId: number, id: number): Promise<FullBaguette> {
    this.logger.debug('Service findOneBaguette() id - ' + id);
    const shop = await this.shops.findOneShop(shopId);

    return await this.baguettes.findOneEntity(shop, id);
  }

  async findAllBaguettes(shopId: number): Promise<FullBaguette[]> {
    this.logger.debug('Service findAllBaguettes()');
    const shop = await this.shops.findOneShop(shopId);

    return await this.baguettes.findAllEntities(shop);
  }
}
