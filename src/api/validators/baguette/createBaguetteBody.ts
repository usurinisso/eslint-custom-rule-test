import { ApiProperty } from '@nestjs/swagger';
import { CreateBaguette } from 'capabilities/baguettes';
import { IsEnum, IsInt, IsNumber, IsPositive, IsString, ValidateIf } from 'class-validator';
import { BaguetteCondition } from 'types/baguetteCondition';
import { BaguetteType } from 'types/baguetteType';

export class CreateBaguetteBody implements CreateBaguette {
  @ApiProperty({ example: 20.0, type: Number })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 25, type: Number })
  @IsInt()
  @IsPositive()
  sizeCm: number;

  @ApiProperty({ type: String, example: 'A very delicious baguette from Italy' })
  @IsString()
  description: string;

  @ApiProperty({
    enum: BaguetteType,
    enumName: 'Baguettes type',
    example: 1,
  })
  @ValidateIf((o) => 'type' in o)
  @IsEnum(BaguetteType)
  type: BaguetteType;

  @ApiProperty({
    enum: BaguetteCondition,
    enumName: 'Baguettes condition',
    example: 1,
  })
  @ValidateIf((o) => 'condition' in o)
  @IsEnum(BaguetteCondition)
  condition: BaguetteCondition;
}
