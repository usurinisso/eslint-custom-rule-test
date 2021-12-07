import { Carts, CreateCart } from 'capabilities/carts';
import { CartNotFoundError } from 'exceptions/cart-not-found';
import { Cart } from 'infrastructure/persistence/entities/cart.entity';
import { BaguetteWithShop } from 'models/baguette';
import { CartWithUser, CartWithUserAndBaguettes, FullCart } from 'models/carts';
import { FullUser } from 'models/users';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> implements Carts {
  async findOneEntity(id: number): Promise<CartWithUserAndBaguettes> {
    const entity = await this.findOne({ where: { id }, relations: ['baguettes', 'user'] });

    if (!entity) {
      throw new CartNotFoundError();
    }

    return entity as unknown as CartWithUserAndBaguettes;
  }

  async createEntity(
    createEntity: CreateCart,
    baguettes: BaguetteWithShop[],
    user: FullUser,
  ): Promise<CartWithUserAndBaguettes> {
    return (await this.save(new Cart(user, baguettes))) as unknown as CartWithUserAndBaguettes;
  }

  async findAllEntities(): Promise<CartWithUser[]> {
    return (await this.find({ relations: ['user'] })) as unknown as CartWithUser[];
  }

  async findAllEntitiesByUser(id: number): Promise<FullCart[]> {
    return (await this.find({
      where: {
        user: {
          id,
        },
      },
    })) as unknown as FullCart[];
  }

  async updateEntity(id: number, baguettes: BaguetteWithShop[]): Promise<CartWithUserAndBaguettes> {
    const entityToUpdate = await this.findOne({ where: { id }, relations: ['baguettes'] });

    if (!entityToUpdate) {
      throw new CartNotFoundError();
    }

    entityToUpdate.baguettes = baguettes ?? entityToUpdate.baguettes;

    await this.save(entityToUpdate);

    return (await this.findOne({
      where: { id },
      relations: ['baguettes', 'user'],
    })) as unknown as CartWithUserAndBaguettes;
  }

  async deleteEntity(id: number): Promise<void> {
    const entityToDelete = await this.findOne(id);

    if (!entityToDelete) {
      throw new CartNotFoundError();
    }

    await this.delete(id);
  }
}
