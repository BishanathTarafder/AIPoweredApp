import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   role: 'user' | 'bot';
   content: string;
};

type props = {
   messages: Message[];
};

const ChatMessages = ({ messages }: props) => {
   const messagesEndRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyMessage = (e: React.ClipboardEvent) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className="flex flex-col gap-2">
         {messages.map((message, index) => (
            <div
               key={index}
               onCopy={onCopyMessage}
               className={`px-3 py-1 ${
                  message.role === 'user'
                     ? 'bg-blue-500 text-white self-end rounded-l-3xl rounded-tr-3xl'
                     : 'bg-gray-200 text-black self-start rounded-r-3xl rounded-tl-3xl'
               }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
         <div ref={messagesEndRef} />
      </div>
   );
};

export default ChatMessages;
