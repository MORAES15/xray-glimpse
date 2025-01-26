import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: inputText,
        sender: 'user'
      }]);
      setInputText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80">
      <Button 
        variant="outline" 
        className="mb-2 ml-auto block"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close Chat' : 'Open Chat'}
      </Button>
      
      {isOpen && (
        <div className="bg-background border rounded-lg shadow-lg">
          <ScrollArea className="h-[400px] p-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                  message.sender === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.text}
              </div>
            ))}
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;