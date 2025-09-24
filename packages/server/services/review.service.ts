import { type Review } from '../generated/prisma';
import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';
import template from '../prompts/summarize-reviews.txt';
// Removed unused import of 'response' from 'express'

export const reviewService = {
   async getReviews(productId: number): Promise<Review[]> {
      return reviewRepository.getReviews(productId);
   },

   async summarizeReviews(productId: number): Promise<string> {
      const existingSummary =
         await reviewRepository.getReviewSummary(productId);
      if (existingSummary && existingSummary.expiryDate > new Date()) {
         return existingSummary.content;
      }

      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');
      const prompt = template.replace('{{reviews}}', joinedReviews);
      const summary = await llmClient.generateText({
         model: 'gemini-1.5-flash',
         prompt,
         temperature: 0.2,
         maxOutputTokens: 500,
      });

      await reviewRepository.storeReviewSummary(productId, summary);

      return summary;
   },
};
