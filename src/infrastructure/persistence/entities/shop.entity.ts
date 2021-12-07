import { Baguette } from 'infrastructure/persistence/entities/baguette.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Shop {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  workHours: string;

  @Column()
  shopImage: string;

  @OneToMany(() => Baguette, (baguette) => baguette.shop, {
    nullable: true,
    cascade: ['insert', 'update', 'remove'],
  })
  baguettes?: Baguette[];

  constructor(address: string, phone: string, workHours: string, shopImage: string, baguettes?: Baguette[]) {
    this.address = address;
    this.phone = phone;
    this.workHours = workHours;
    this.shopImage = shopImage;
    this.baguettes = baguettes;
  }
}
