import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import ChatMessage, { type ChatMessage as ChatMessageType } from './ChatMessage';
import { useToast } from '@/components/ui/use-toast';
import { generateResponse } from './services/huggingFaceService';

const ChatContainer = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleNewMessage = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: ChatMessageType }>;
      setMessages(prevMessages => [...prevMessages, customEvent.detail.message]);
    };

    document.addEventListener('newChatMessage', handleNewMessage);
    return () => {
      document.removeEventListener('newChatMessage', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;
  
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };
  
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
  
    try {
      const messageHistory = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));
  
      const botResponse = await generateResponse(inputText, messageHistory);
  
      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'JamesBot',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response from the AI. Please try again.",
        variant: "destructive"
      });
      console.error('Error getting bot response:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full glass-dark rounded-lg overflow-hidden">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">AI Assistant</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto min-h-[400px] messages-container">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {messages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Ask me about medical imaging findings or upload an X-Ray for analysis</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-background/20 rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground resize-none min-h-[44px] max-h-[120px]"
              disabled={isLoading}
              rows={1}
            />
            <Button 
              onClick={handleSendMessage}
              variant="default"
              className="bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;