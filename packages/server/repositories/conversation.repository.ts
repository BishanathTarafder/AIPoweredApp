import { v4 as uuidv4 } from 'uuid';

export interface Message {
   role: 'user' | 'model';
   content: string;
   timestamp: Date;
}

export interface Conversation {
   id: string;
   messages: Message[];
   createdAt: Date;
   updatedAt: Date;
}

export class ConversationRepository {
   private conversations: Map<string, Conversation> = new Map();

   createConversation(): Conversation {
      const conversation: Conversation = {
         id: uuidv4(),
         messages: [],
         createdAt: new Date(),
         updatedAt: new Date(),
      };

      this.conversations.set(conversation.id, conversation);
      return conversation;
   }

   findById(id: string): Conversation | undefined {
      return this.conversations.get(id);
   }

   save(conversation: Conversation): void {
      conversation.updatedAt = new Date();
      this.conversations.set(conversation.id, conversation);
   }

   addMessage(conversationId: string, message: Message): Conversation | null {
      const conversation = this.conversations.get(conversationId);
      if (!conversation) return null;

      conversation.messages.push(message);
      conversation.updatedAt = new Date();
      this.conversations.set(conversationId, conversation);

      return conversation;
   }

   getAll(): Conversation[] {
      return Array.from(this.conversations.values());
   }

   delete(id: string): boolean {
      return this.conversations.delete(id);
   }

   count(): number {
      return this.conversations.size;
   }
}
