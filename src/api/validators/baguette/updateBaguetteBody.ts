import { ApiProperty } from '@nestjs/swagger';
import { UpdateBaguette } from 'capabilities/baguettes';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, IsString, ValidateIf } from 'class-validator';
import { BaguetteCondition } from 'types/baguetteCondition';
import { BaguetteType } from 'types/baguetteType';

export class UpdateBaguetteBody implements UpdateBaguette {
  @ApiProperty({ example: 20.0, type: Number })
  @ValidateIf((o) => 'price' in o) //This was fun.. IsOptional lets "price": null through.. also
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({ example: 25, type: Number })
  @ValidateIf((o) => 'sizeCm' in o)
  @IsInt()
  @IsPositive()
  sizeCm?: number;

  @ApiProperty({ type: String, example: 'A very delicious baguette from Italy' })
  @ValidateIf((o) => 'description' in o)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: BaguetteType,
    enumName: 'Baguettes type',
    example: 1,
  })
  @ValidateIf((o) => 'type' in o)
  @IsEnum(BaguetteType)
  type?: BaguetteType;

  @ApiProperty({
    enum: BaguetteCondition,
    enumName: 'Baguettes condition',
    example: 1,
  })
  @ValidateIf((o) => 'condition' in o)
  @IsEnum(BaguetteCondition)
  condition?: BaguetteCondition;
}
