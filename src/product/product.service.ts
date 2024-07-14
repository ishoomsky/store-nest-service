import { Injectable } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // async create(productData: Product): Promise<Product> {
  //   return this.prisma.product.create({
  //     data: productData,
  //   });
  // }

  async getProducts(
    page: number,
    pageSize: number,
    masterCategory?: string,
    subCategory?: string,
  ): Promise<Product[]> {
    const skip = (page - 1) * pageSize;
    const where = {};
    if (masterCategory) {
      where['masterCategory'] = masterCategory;
    }
    if (subCategory) {
      where['subCategory'] = subCategory;
    }

    console.log('where', where);

    return this.prisma.product.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { id: 'asc' },
    });
  }

  public async findAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  public async findProduct(productId: string): Promise<Product> {
    return this.prisma.product.findFirst({
      where: {
        id: {
          equals: productId,
        },
      },
    });
  }
  //
  // public async getProductGender(): Promise<string[]> {
  //   return this.getDistinctValues('gender');
  // }
  //
  // public async getProductMasterCategory(): Promise<string[]> {
  //   return this.getDistinctValues('masterCategory');
  // }
  //
  // public async getProductSubCategory(): Promise<string[]> {
  //   return this.getDistinctValues('subCategory');
  // }
  //
  // public async getProductArticleType(): Promise<string[]> {
  //   return this.getDistinctValues('articleType');
  // }
  //
  // public async getProductBaseColour(): Promise<string[]> {
  //   return this.getDistinctValues('baseColour');
  // }
  //
  // public async getProductSeason(): Promise<string[]> {
  //   return this.getDistinctValues('season');
  // }
  //
  // public async getProductYear(): Promise<string[]> {
  //   return this.getDistinctValues('year');
  // }
  //
  // public async getProductUsage(): Promise<string[]> {
  //   return this.getDistinctValues('usage');
  // }
  //
  // private async getDistinctValues(
  //   columnName: keyof Product,
  // ): Promise<string[]> {
  //   const values = await this.prisma.product.findMany({
  //     distinct: [columnName],
  //     select: { [columnName]: true },
  //   });
  //   return values.map((category) => category[columnName]);
  // }
  // // async getDistinctValues(columnNames: (keyof Product)[]): Promise<Record<string, string[]>> {
  // //   const distinctValues: Record<string, string[]> = {};
  // //
  // //   const distinctValuesResult = await this.prisma.product.groupBy({
  // //     by: columnNames.map(columnName => ({ [columnName]: columnName })),
  // //     orderBy: columnNames.map(columnName => ({ [columnName]: 'asc' })),
  // //     select: columnNames.reduce((acc, columnName) => ({ ...acc, [columnName]: { distinct: true } }), {}),
  // //   });
  // //
  // //   columnNames.forEach(columnName => {
  // //     distinctValues[columnName] = distinctValuesResult.map(item => item[columnName]);
  // //   });
  // //
  // //   return distinctValues;
  // // }
}
