import { Cart } from 'infrastructure/persistence/entities/cart.entity';
import { Order } from 'infrastructure/persistence/entities/order.entity';
import { Shop } from 'infrastructure/persistence/entities/shop.entity';
import { DateTime } from 'luxon';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaguetteCondition } from 'types/baguetteCondition';
import { BaguetteType } from 'types/baguetteType';
@Entity()
export class Baguette {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column('decimal', { precision: 5, scale: 2 })
  price: number;

  @Column('int', { width: 3 })
  sizeCm: number;

  @Column()
  description: string;

  @Column('enum', { enum: BaguetteType, default: BaguetteType['White'] })
  type: BaguetteType;

  @Column('enum', { enum: BaguetteCondition, default: BaguetteCondition['Hot and fresh'] })
  condition: BaguetteCondition;

  @CreateDateColumn({ type: 'timestamp' })
  readonly bakedAt: DateTime;

  @ManyToOne(() => Shop, (shop) => shop.baguettes, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  shop: Shop;

  @ManyToOne(() => Order, (order) => order.baguettes, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'nullify',
  })
  order?: Order;

  @ManyToMany(() => Cart, (cart) => cart.baguettes, {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinTable()
  carts?: Cart[];

  constructor(
    price: number,
    sizeCm: number,
    description: string,
    type: BaguetteType,
    condition: BaguetteCondition,
    shop: Shop,
    order?: Order,
    carts?: Cart[],
  ) {
    this.price = price;
    this.sizeCm = sizeCm;
    this.description = description;
    this.type = type;
    this.condition = condition;
    this.shop = shop;
    this.order = order;
    this.carts = carts;
  }
}
