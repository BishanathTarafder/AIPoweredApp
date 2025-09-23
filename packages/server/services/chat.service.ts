import fs from 'fs';
import path from 'path';
import { llmClient } from '../llm/client';
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
   private conversationRepo: ConversationRepository;

   constructor() {
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
      if (conversation.messages.length > 1) {
         // For conversations with history, you'll need to build context
         const history = conversation.messages
            .slice(0, -1)
            .map(
               (msg) =>
                  `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
            )
            .join('\n');

         const contextualPrompt = `${instructions}\n\nConversation History:\n${history}\n\nUser: ${prompt}\n\nAssistant:`;

         return llmClient.generateText({
            model: 'gemini-1.5-flash',
            prompt: contextualPrompt,
            temperature: 0.7,
            maxOutputTokens: 500,
         });
      } else {
         // First message
         const fullPrompt = `${instructions}\n\nUser: ${prompt}\n\nAssistant:`;

         return llmClient.generateText({
            model: 'gemini-1.5-flash',
            prompt: fullPrompt,
            temperature: 0.7,
            maxOutputTokens: 500,
         });
      }
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
