import { Logger } from '@nestjs/common';
import { Baguettes } from 'capabilities/baguettes';
import { Carts, CreateCart, UpdateCart } from 'capabilities/carts';
import { Users } from 'capabilities/users';
import { CartNotFoundError } from 'exceptions/cart-not-found';
import { CartWithUser, CartWithUserAndBaguettes, FullCart } from 'models/carts';

export class CartService {
  constructor(private readonly carts: Carts, private readonly baguettes: Baguettes, private readonly users: Users) {}
  private readonly logger = new Logger();

  async deleteCart(id: number): Promise<void> {
    this.logger.debug('Service deleteCart() id - ' + id);

    await this.carts.deleteEntity(id);
  }

  async updateCart(id: number, cart: UpdateCart): Promise<CartWithUserAndBaguettes> {
    this.logger.debug('Service updateCart() id - ' + id, cart);
    const baguettesToCart = await this.baguettes.findManyByIds(cart.baguetteIds);

    return await this.carts.updateEntity(id, baguettesToCart);
  }

  async createCart(createCart: CreateCart): Promise<CartWithUserAndBaguettes> {
    this.logger.debug('Service createCart()');
    const baguettesToCart = await this.baguettes.findManyByIds(createCart.baguetteIds);
    const { cart, orders, ...user } = await this.users.findOneEntity(createCart.userId);

    try {
      this.logger.debug('Deleting previous cart');
      await this.carts.deleteEntity(cart.id);
    } catch (err) {
      if (err instanceof CartNotFoundError) {
        this.logger.debug('No Previous cart found');
      }
    }

    return await this.carts.createEntity(createCart, baguettesToCart, user);
  }

  async findOneCart(id: number): Promise<CartWithUserAndBaguettes> {
    this.logger.debug('Service findOneCart() id - ' + id);
    return await this.carts.findOneEntity(id);
  }

  async findAllCarts(): Promise<CartWithUser[]> {
    this.logger.debug('Service findAllCarts()');

    return await this.carts.findAllEntities();
  }

  async findAllCartsByUser(id: number): Promise<FullCart[]> {
    this.logger.debug('Service findAllCartsByUser() id - ', id);

    return await this.carts.findAllEntitiesByUser(id);
  }
}
