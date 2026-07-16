import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

// Единый набор связей, отдаваемых в API карточки товара.
const productInclude = {
  brand: true,
  primaryCategory: true,
  compressorModel: true,
  categories: { include: { category: true } },
  variants: { include: { crossNumbers: true } },
  media: { orderBy: { position: 'asc' } },
  attributeValues: { include: { attribute: true, option: true } },
  compatibility: { include: { compressorModel: true } },
} satisfies Prisma.ProductInclude;

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    const { categoryIds, variants, specsExtra, ...rest } = createProductDto;
    return this.prismaService.product.create({
      data: {
        ...rest,
        specsExtra: specsExtra as Prisma.InputJsonValue | undefined,
        categories: categoryIds?.length
          ? { create: categoryIds.map((categoryId) => ({ categoryId })) }
          : undefined,
        variants: { create: variants },
      },
      include: productInclude,
    });
  }

  findAll() {
    return this.prismaService.product.findMany({
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prismaService.product.findUnique({
      where: { id },
      include: productInclude,
    });
  }

  // ST-1: обновляем поля ядра и (опционально) состав категорий.
  // Вложенные варианты/атрибуты/совместимость — отдельными эндпоинтами (следующие карточки).
  update(id: string, updateProductDto: UpdateProductDto) {
    const {
      categoryIds,
      variants: _variants,
      specsExtra,
      ...rest
    } = updateProductDto;
    return this.prismaService.product.update({
      where: { id },
      data: {
        ...rest,
        ...(specsExtra !== undefined
          ? { specsExtra: specsExtra as Prisma.InputJsonValue }
          : {}),
        ...(categoryIds
          ? {
              categories: {
                deleteMany: {},
                create: categoryIds.map((categoryId) => ({ categoryId })),
              },
            }
          : {}),
      },
      include: productInclude,
    });
  }

  remove(id: string) {
    return this.prismaService.product.delete({
      where: { id },
    });
  }
}
