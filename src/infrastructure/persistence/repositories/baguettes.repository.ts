import { Baguettes, CreateBaguette, UpdateBaguette } from 'capabilities/baguettes';
import { BaguetteNotFoundError } from 'exceptions/baguette-not-found';
import { BaguetteWithShop, FullBaguette } from 'models/baguette';
import { FullShop } from 'models/shops';
import { EntityRepository, In, Repository } from 'typeorm';

import { Baguette } from '../entities/baguette.entity';

@EntityRepository(Baguette)
export class BaguetteRepository extends Repository<Baguette> implements Baguettes {
  async findAllEntities(shop: FullShop): Promise<FullBaguette[]> {
    return await this.find({ where: { shop, order: null } });
  }

  async findManyByIds(ids: number[]): Promise<BaguetteWithShop[]> {
    return await this.find({
      where: { id: In(ids) },
      relations: ['shop'],
    });
  }

  async findOneEntity(shop: FullShop, id: number): Promise<FullBaguette> {
    const baguette = await this.findOne({ where: { id, shop } });

    if (!baguette) {
      throw new BaguetteNotFoundError();
    }

    return baguette;
  }

  async createEntity(shop: FullShop, baguette: CreateBaguette): Promise<FullBaguette> {
    return await this.save(
      new Baguette(baguette.price, baguette.sizeCm, baguette.description, baguette.type, baguette.condition, shop),
    );
  }

  async updateEntity(shop: FullShop, id: number, baguette: UpdateBaguette): Promise<FullBaguette> {
    const baguetteToUpdate = await this.findOne({ id, shop });

    if (!baguetteToUpdate) {
      throw new BaguetteNotFoundError();
    }

    baguetteToUpdate.type = baguette.type ?? baguetteToUpdate.type;
    baguetteToUpdate.price = baguette.price ?? baguetteToUpdate.price;
    baguetteToUpdate.sizeCm = baguette.sizeCm ?? baguetteToUpdate.sizeCm;
    baguetteToUpdate.description = baguette.description ?? baguetteToUpdate.description;
    baguetteToUpdate.condition = baguette.condition ?? baguetteToUpdate.condition;

    await this.save(baguetteToUpdate);

    return await this.findOne(id);
  }

  async deleteEntity(shop: FullShop, id: number): Promise<void> {
    const baguette = await this.findOne({ id, shop });

    if (!baguette) {
      throw new BaguetteNotFoundError();
    }

    await this.delete(id);
  }
}
