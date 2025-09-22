import { Router } from 'express';
import type { Express } from 'express';
import type { Request, Response } from 'express';
import { ChatController } from './controllers/chat.controller';
import { PrismaClient } from './generated/prisma';
import { number } from 'zod';
import { reviewController } from './controllers/review.controller';

const chatController = new ChatController();

export const setupRoutes = (app: Express) => {
   const router = Router();

   // Chat routes
   router.post('/chat', chatController.sendMessage.bind(chatController));

   router.get('/products/:id/reviews', reviewController.getReviews);

   // Mount API routes
   app.use('/api', router);

   // Health check
   app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date() });
   });
};
