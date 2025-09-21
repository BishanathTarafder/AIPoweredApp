import type { Request, Response } from 'express';
import { z } from 'zod';
import { ChatService } from '../services/chat.service';

// Zod validation schemas
const ChatRequestSchema = z.object({
   prompt: z
      .string()
      .min(1, 'Prompt cannot be empty')
      .max(10000, 'Prompt too long (max 10,000 characters)'),
   conversationId: z.string().uuid('Invalid conversation ID format').optional(),
});

export class ChatController {
   private chatService: ChatService;

   constructor() {
      this.chatService = new ChatService();
   }

   async sendMessage(req: Request, res: Response): Promise<void> {
      try {
         // Validate request body
         const validationResult = ChatRequestSchema.safeParse(req.body);

         if (!validationResult.success) {
            res.status(400).json({
               error: 'Validation failed',
               details: validationResult.error.issues.map((err) => ({
                  field: err.path.join('.'),
                  message: err.message,
               })),
            });
            return;
         }

         const { prompt, conversationId } = validationResult.data;

         // Process chat message
         const result = await this.chatService.sendMessage(
            prompt,
            conversationId
         );

         res.json(result);
      } catch (error: any) {
         console.error('Chat Controller Error:', error);

         if (error.message === 'Conversation not found') {
            res.status(404).json({
               error: 'Conversation not found',
            });
            return;
         }

         // Handle Gemini API specific errors
         if (error.message.includes('429')) {
            res.status(429).json({
               error: 'Rate limit exceeded. Please wait a moment and try again.',
               code: 'RATE_LIMIT_EXCEEDED',
            });
            return;
         }

         res.status(500).json({
            error: 'Internal server error',
         });
      }
   }

   async getConversation(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;

         // Validate UUID
         if (!z.string().uuid().safeParse(id).success) {
            res.status(400).json({
               error: 'Invalid conversation ID format',
            });
            return;
         }

         const conversation = this.chatService.getConversation(id);

         if (!conversation) {
            res.status(404).json({
               error: 'Conversation not found',
            });
            return;
         }

         res.json(conversation);
      } catch (error: any) {
         console.error('Get Conversation Error:', error);
         res.status(500).json({
            error: 'Internal server error',
         });
      }
   }

   async getAllConversations(req: Request, res: Response): Promise<void> {
      try {
         const conversations = this.chatService.getAllConversations();

         const summary = conversations.map((conv) => ({
            id: conv.id,
            messageCount: conv.messages.length,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            lastMessage:
               conv.messages.length > 0
                  ? conv.messages[conv.messages.length - 1]?.content?.substring(
                       0,
                       100
                    ) + '...'
                  : 'No messages yet',
         }));

         res.json(summary);
      } catch (error: any) {
         console.error('Get All Conversations Error:', error);
         res.status(500).json({
            error: 'Internal server error',
         });
      }
   }

   async deleteConversation(req: Request, res: Response): Promise<void> {
      try {
         const { id } = req.params;

         // Validate UUID
         if (!z.string().uuid().safeParse(id).success) {
            res.status(400).json({
               error: 'Invalid conversation ID format',
            });
            return;
         }

         const deleted = this.chatService.deleteConversation(id);

         if (deleted) {
            res.json({
               message: 'Conversation deleted successfully',
            });
         } else {
            res.status(404).json({
               error: 'Conversation not found',
            });
         }
      } catch (error: any) {
         console.error('Delete Conversation Error:', error);
         res.status(500).json({
            error: 'Internal server error',
         });
      }
   }
}
