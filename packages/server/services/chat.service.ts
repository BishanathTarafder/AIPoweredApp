import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
   ConversationRepository,
   type Conversation,
   type Message,
} from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

interface ChatResponse {
   conversationId: string;
   message: string;
   messageCount: number;
}

export class ChatService {
   private client: GoogleGenerativeAI;
   private conversationRepo: ConversationRepository;

   constructor() {
      this.client = new GoogleGenerativeAI(
         process.env.GEMINI_API_KEY as string
      );
      this.conversationRepo = new ConversationRepository();
   }

   async sendMessage(
      prompt: string,
      conversationId?: string
   ): Promise<ChatResponse> {
      try {
         let conversation: Conversation;

         // Get or create conversation
         if (conversationId) {
            const existingConversation =
               this.conversationRepo.findById(conversationId);
            if (!existingConversation) {
               throw new Error('Conversation not found');
            }
            conversation = existingConversation;
         } else {
            conversation = this.conversationRepo.createConversation();
         }

         // Add user message
         const userMessage: Message = {
            role: 'user',
            content: prompt,
            timestamp: new Date(),
         };

         conversation = this.conversationRepo.addMessage(
            conversation.id,
            userMessage
         )!;

         // Generate AI response
         const aiResponse = await this.generateAIResponse(prompt, conversation);

         // Add AI message
         const aiMessage: Message = {
            role: 'model',
            content: aiResponse,
            timestamp: new Date(),
         };

         conversation = this.conversationRepo.addMessage(
            conversation.id,
            aiMessage
         )!;

         return {
            conversationId: conversation.id,
            message: aiResponse,
            messageCount: conversation.messages.length,
         };
      } catch (error: any) {
         console.error('Chat Service Error:', error);
         throw error;
      }
   }

   private async generateAIResponse(
      prompt: string,
      conversation: Conversation
   ): Promise<string> {
      const model = this.client.getGenerativeModel({
         model: 'gemini-1.5-flash',
         systemInstruction: instructions,
      });

      let result;
      if (conversation.messages.length > 1) {
         // Use conversation history for context (excluding the just-added user message)
         const history = conversation.messages.slice(0, -1).map((msg) => ({
            role: msg.role,
            parts: [{ text: msg.content }],
         }));

         const chat = model.startChat({ history });
         result = await chat.sendMessage(prompt);
      } else {
         // First message
         result = await model.generateContent(prompt);
      }

      const response = await result.response;
      return response.text();
   }

   getConversation(id: string): Conversation | undefined {
      return this.conversationRepo.findById(id);
   }

   getAllConversations(): Conversation[] {
      return this.conversationRepo.getAll();
   }

   deleteConversation(id: string): boolean {
      return this.conversationRepo.delete(id);
   }
}
