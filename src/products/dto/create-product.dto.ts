import { ApiProperty } from '@nestjs/swagger';
import { ProductKind } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Артикул (SKU)' })
  sku: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Название варианта, напр. «G1/2», «380В»',
  })
  name?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({ required: false })
  price?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, default: 'RUB' })
  currency?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  priceOnRequest?: boolean;

  @IsInt()
  @IsOptional()
  @Min(0)
  @ApiProperty({ required: false, default: 0 })
  stock?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: true })
  isDefault?: boolean;
}

export class CreateProductDto {
  @IsEnum(ProductKind)
  @ApiProperty({ enum: ProductKind })
  kind: ProductKind;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Уникальный слаг для URL' })
  slug: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false })
  brandId?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({ required: false, description: 'Канонический раздел' })
  primaryCategoryId?: number;

  @IsInt()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Для kind=COMPRESSOR: связанная модель',
  })
  compressorModelId?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  published?: boolean;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @ApiProperty({
    required: false,
    type: [Number],
    description: 'Категории товара (M2M)',
  })
  categoryIds?: number[];

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @ApiProperty({
    type: [CreateVariantDto],
    description: 'Как минимум один вариант (SKU)',
  })
  variants: CreateVariantDto[];

  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'JSON-хвост редких характеристик',
  })
  specsExtra?: unknown;
}
