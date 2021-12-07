import * as bcrypt from 'bcrypt';
import { Cart } from 'infrastructure/persistence/entities/cart.entity';
import { Order } from 'infrastructure/persistence/entities/order.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleType } from 'types/roleType';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column('enum', { enum: RoleType, default: String(RoleType.guest) })
  role: RoleType;

  @OneToMany(() => Order, (order) => order.user, {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
  })
  orders?: Order[];

  @OneToOne(() => Cart, (cart) => cart.user, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'nullify',
  })
  cart?: Cart;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }

  constructor(
    firstName: string,
    lastName: string,
    userName: string,
    password: string,
    role?: RoleType,
    orders?: Order[],
    cart?: Cart,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.password = password;
    this.role = role;
    this.orders = orders;
    this.cart = cart;
  }
}
