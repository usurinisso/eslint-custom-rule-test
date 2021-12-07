import { Baguette } from 'infrastructure/persistence/entities/baguette.entity';
import { User } from 'infrastructure/persistence/entities/user.entity';
import { Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @OneToOne(() => User, (user) => user.cart, {
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Baguette, (baguette) => baguette.carts, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  baguettes?: Baguette[];

  constructor(user: User, baguettes?: Baguette[]) {
    this.user = user;
    this.baguettes = baguettes;
  }
}
