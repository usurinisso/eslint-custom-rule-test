import { ApiProperty } from '@nestjs/swagger';
import { DateTime } from 'luxon';
import { FullBaguette } from 'models/baguette';
import { BaguetteCondition } from 'types/baguetteCondition';
import { BaguetteType } from 'types/baguetteType';

export class Baguette {
  @ApiProperty({ example: 1, type: Number })
  id: number;

  @ApiProperty({ example: 20.0, type: Number })
  price: number;

  @ApiProperty({ example: 25, type: Number })
  sizeCm: number;

  @ApiProperty({
    enum: BaguetteType,
    enumName: 'Baguettes type',
    example: 1,
  })
  type: BaguetteType;

  @ApiProperty({ type: String, example: 'A very delicious baguette from italy' })
  description: string;

  @ApiProperty({
    enum: BaguetteCondition,
    enumName: 'Baguettes condition',
    example: 1,
  })
  condition: BaguetteCondition;

  @ApiProperty({ example: DateTime.now(), type: DateTime })
  bakedAt: DateTime;

  constructor(
    id: number,
    price: number,
    sizeCm: number,
    type: BaguetteType,
    description: string,
    condition: BaguetteCondition,
    bakedAt: DateTime,
  ) {
    this.id = id;
    this.price = price;
    this.sizeCm = sizeCm;
    this.type = type;
    this.description = description;
    this.condition = condition;
    this.bakedAt = bakedAt;
  }

  public static from(baguette: FullBaguette): Baguette {
    return new Baguette(
      baguette.id,
      baguette.price,
      baguette.sizeCm,
      baguette.type,
      baguette.description,
      baguette.condition,
      baguette.bakedAt,
    );
  }
}
