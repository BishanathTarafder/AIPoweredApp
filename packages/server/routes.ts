import { Router } from 'express';
import type { Express } from 'express';
import type { Request, Response } from 'express';
import { ChatController } from './controllers/chat.controller';
import { PrismaClient } from './generated/prisma';
import { number } from 'zod';

const chatController = new ChatController();

export const setupRoutes = (app: Express) => {
   const router = Router();

   // Chat routes
   router.post('/chat', chatController.sendMessage.bind(chatController));

   router.get('/products/:id/reviews', async (req: Request, res: Response) => {
      const prisma = new PrismaClient();
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         return res.status(400).json({ error: 'Invalid product ID' });
      }

      const reviews = await prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });

      res.json(reviews);
   });

   // Mount API routes
   app.use('/api', router);

   // Health check
   app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date() });
   });
};
