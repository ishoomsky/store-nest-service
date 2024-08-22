import { Injectable } from '@nestjs/common';
// import { Product } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // async create(productData: Product): Promise<Product> {
  //   return this.prisma.product.create({
  //     data: productData,
  //   });
  // }
  //
  // async getProducts(
  //   page: number,
  //   pageSize: number,
  //   masterCategory?: string,
  //   subCategory?: string,
  // ): Promise<Product[]> {
  //   const skip = (page - 1) * pageSize;
  //   const where = {};
  //   if (masterCategory) {
  //     where['masterCategory'] = masterCategory;
  //   }
  //   if (subCategory) {
  //     where['subCategory'] = subCategory;
  //   }
  //
  //   console.log('where', where);
  //
  //   return this.prisma.product.findMany({
  //     where,
  //     skip,
  //     take: pageSize,
  //     orderBy: { id: 'asc' },
  //   });
  // }
  //
  // public async findAllProducts(): Promise<Product[]> {
  //   return this.prisma.product.findMany();
  // }
  //
  // public async findProduct(productId: string): Promise<Product> {
  //   return this.prisma.product.findFirst({
  //     where: {
  //       id: {
  //         equals: productId,
  //       },
  //     },
  //   });
  // }
}
