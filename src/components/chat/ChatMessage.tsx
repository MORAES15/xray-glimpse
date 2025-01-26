import React from 'react';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`px-4 py-2 rounded-lg max-w-[80%] ${
        message.sender === 'user' 
          ? 'bg-medical text-white' 
          : 'bg-background/20 text-foreground'
      }`}>
        <p className="text-sm">{message.text}</p>
        <span className="text-xs opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;