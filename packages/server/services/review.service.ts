import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joined = reviews.map((r) => r.content).join('\n\n');
      const summary = `Summary of reviews for product ${productId}:\n\n${joined}`;

      return summary;
   },
};
