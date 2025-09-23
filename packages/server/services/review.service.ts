import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = `Summarize the following customer reviews into a short paragraph highlighting key themes, both positive and negative:${joinedReviews}`;
      return llmClient.generateText({
         model: 'gemini-1.5-flash',
         prompt,
         temperature: 0.2,
         maxOutputTokens: 500,
      });
   },
};
