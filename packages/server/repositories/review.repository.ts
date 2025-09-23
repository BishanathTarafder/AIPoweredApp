import { PrismaClient, type Review } from '../generated/prisma';

export const reviewRepository = {
   async getReviews(productId: number, limit?: Number): Promise<Review[]> {
      const prisma = new PrismaClient();

      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit ? Number(limit) : undefined,
      });
   },
};
