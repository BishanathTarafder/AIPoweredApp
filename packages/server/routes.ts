import { Router } from 'express';
import type { Express } from 'express';
import { ChatController } from './controllers/chat.controller';

const chatController = new ChatController();

export const setupRoutes = (app: Express) => {
   const router = Router();

   // Chat routes
   router.post('/chat', chatController.sendMessage.bind(chatController));

   // Mount API routes
   app.use('/api', router);

   // Health check
   app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date() });
   });
};
