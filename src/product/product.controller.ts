import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from '@prisma/client';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('products')
  async getProducts(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('masterCategory') masterCategory?: string,
    @Query('subCategory') subCategory?: string,
  ): Promise<Product[]> {
    return this.productService.getProducts(
      Number(page),
      Number(pageSize),
      masterCategory,
      subCategory,
    );
  }

  @Get('product/props/gender')
  public async getProductGender(): Promise<{
    productGender: string[];
  }> {
    const productGender = await this.productService.getProductGender();
    return { productGender };
  }

  @Get('product/props/master-category')
  public async getProductMasterCategory(): Promise<{
    productMasterCategory: string[];
  }> {
    const productMasterCategory =
      await this.productService.getProductMasterCategory();
    return { productMasterCategory };
  }

  @Get('product/props/sub-category')
  public async getProductSubCategory(): Promise<{
    productSubCategory: string[];
  }> {
    const productSubCategory =
      await this.productService.getProductSubCategory();
    return { productSubCategory };
  }

  @Post('product')
  public async findFirst(@Body('productId') productId: string): Promise<{
    product: Product;
  }> {
    const product = await this.productService.findProduct(productId);
    return { product };
  }
}
