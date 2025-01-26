import React, { useState } from 'react';
import { Button } from '../ui/button';
import ChatMessage, { type ChatMessage as ChatMessageType } from './ChatMessage';
import { useToast } from '../ui/use-toast';

const ChatContainer = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simulate system response
    setTimeout(() => {
      const systemResponse: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: "I've received your message. This is a demo response.",
        sender: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemResponse]);
    }, 1000);

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Chat</h2>
      <div className="h-[400px] bg-[#F1F0FB] dark:bg-background/20 rounded-lg p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm">No messages yet. Start a conversation!</p>
        ) : (
          messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type your message..."
          className="flex-1 bg-background/20 rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground"
        />
        <Button 
          onClick={handleSendMessage}
          className="bg-medical text-white hover:bg-medical/80"
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatContainer;