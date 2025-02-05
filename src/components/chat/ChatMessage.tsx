import React from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system' | 'JamesBot';
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
        isUser 
          ? 'bg-medical text-white' 
          : 'bg-background/20 text-foreground'
      }`}>
        <p className="text-sm whitespace-pre-line">{message.text}</p>
        <span className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;