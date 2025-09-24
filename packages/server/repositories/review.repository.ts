import dayjs from 'dayjs';
import { PrismaClient, type Review } from '../generated/prisma';
import { get } from 'http';

const prisma = new PrismaClient();

export const reviewRepository = {
   async getReviews(productId: number, limit?: Number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit ? Number(limit) : undefined,
      });
   },

   storeReviewSummary: (productId: number, summary: string) => {
      const now = new Date();
      const expiryDate = dayjs().add(7, 'day').toDate();
      const data = {
         content: summary,
         expiryDate,
         generatedAt: now,
         productId,
      };

      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   getReviewSummary: (productId: number) => {
      return prisma.summary.findUnique({
         where: { productId },
      });
   },
};
