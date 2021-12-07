import { CreateShop, Shops, UpdateShop } from 'capabilities/shops';
import { ShopNotFoundError } from 'exceptions/shop-not-found';
import { Shop } from 'infrastructure/persistence/entities/shop.entity';
import { FullShop } from 'models/shops';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Shop)
export class ShopRepository extends Repository<Shop> implements Shops {
  async findOneEntity(shopId: number): Promise<FullShop> {
    const shop = await this.findOne({ where: { id: shopId } });

    if (!shop) {
      throw new ShopNotFoundError();
    }

    return shop as unknown as FullShop;
  }

  async createEntity(shop: CreateShop): Promise<FullShop> {
    return await this.save(new Shop(shop.phone, shop.address, shop.workHours, shop.shopImage));
  }

  async findAllEntities(): Promise<FullShop[]> {
    return await this.find();
  }

  async updateEntity(id: number, shop: UpdateShop): Promise<FullShop> {
    const shopToUpdate = await this.findOne(id);

    if (!shopToUpdate) {
      throw new ShopNotFoundError();
    }

    shopToUpdate.shopImage = shop.shopImage ?? shopToUpdate.shopImage;
    shopToUpdate.phone = shop.phone ?? shopToUpdate.phone;
    shopToUpdate.workHours = shop.workHours ?? shopToUpdate.workHours;

    await this.save(shopToUpdate);

    return await this.findOne(id);
  }

  async deleteEntity(id: number): Promise<void> {
    const shop = await this.findOne(id);

    if (!shop) {
      throw new ShopNotFoundError();
    }

    await this.delete(id);
  }
}
