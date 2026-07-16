import { ApiProperty } from '@nestjs/swagger';
import { ProductKind } from '@prisma/client';

export class ProductEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ProductKind })
  kind: ProductKind;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ required: false, nullable: true })
  description: string | null;

  @ApiProperty({ required: false, nullable: true })
  brandId: number | null;

  @ApiProperty({ required: false, nullable: true })
  primaryCategoryId: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'Для kind=COMPRESSOR',
  })
  compressorModelId: number | null;

  @ApiProperty({ default: false })
  published: boolean;

  @ApiProperty({
    required: false,
    nullable: true,
    description: 'JSON-хвост характеристик',
  })
  specsExtra: unknown;

  @ApiProperty({
    isArray: true,
    description: 'Варианты (SKU): sku, price, currency, stock, crossNumbers',
  })
  variants: unknown[];

  @ApiProperty({ isArray: true, description: 'Категории товара (M2M)' })
  categories: unknown[];

  @ApiProperty({ required: false, nullable: true, description: 'Бренд' })
  brand: unknown;

  @ApiProperty({ isArray: true, description: 'Значения атрибутов' })
  attributeValues: unknown[];

  @ApiProperty({
    isArray: true,
    description: 'Совместимые модели компрессоров (для запчастей)',
  })
  compatibility: unknown[];

  @ApiProperty({ isArray: true, description: 'Медиа/изображения' })
  media: unknown[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
