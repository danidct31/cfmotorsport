import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FALLBACK_PRODUCTS } from './fallback-products';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(category?: string) {
    if (!this.prisma.connected) {
      return FALLBACK_PRODUCTS.filter((p) =>
        category ? p.category === category : true,
      );
    }

    try {
      return await this.prisma.product.findMany({
        where: category ? { category } : undefined,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      });
    } catch {
      return FALLBACK_PRODUCTS.filter((p) =>
        category ? p.category === category : true,
      );
    }
  }

  async findFeatured() {
    if (!this.prisma.connected) {
      return FALLBACK_PRODUCTS.filter((p) => p.featured);
    }

    try {
      return await this.prisma.product.findMany({
        where: { featured: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch {
      return FALLBACK_PRODUCTS.filter((p) => p.featured);
    }
  }

  async findBySlug(slug: string) {
    if (!this.prisma.connected) {
      const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      if (!product) {
        throw new NotFoundException(`Product "${slug}" not found`);
      }
      return product;
    }

    try {
      const product = await this.prisma.product.findUnique({ where: { slug } });
      if (!product) {
        throw new NotFoundException(`Product "${slug}" not found`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      const product = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
      if (!product) {
        throw new NotFoundException(`Product "${slug}" not found`);
      }
      return product;
    }
  }
}
