import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import ChatMessage, { type ChatMessage as ChatMessageType } from './ChatMessage';
import { useToast } from '../ui/use-toast';

const diagnosticMessages = [
  "Clear Pneumonia Case:\nProminent bilateral infiltrates in lower lung zones, consistent with bacterial pneumonia. Dense consolidation in right lower lobe with air bronchograms. Recommend antibiotic therapy and follow-up imaging in 6-8 weeks.",
  "Normal Healthy Chest:\nClear lung fields bilaterally. Normal cardiac silhouette without cardiomegaly. No pleural effusions or pneumothorax. Unremarkable mediastinal contours. Routine follow-up recommended.",
  "Pulmonary Edema:\nBilateral interstitial edema with prominent Kerley B lines. Enlarged cardiac silhouette suggesting congestive heart failure. Cephalization of pulmonary vessels. Requires urgent cardiac evaluation.",
  "Lung Mass:\n3cm spiculated mass in right upper lobe highly suspicious for primary lung malignancy. No pleural effusions. Mediastinal lymphadenopathy noted. Immediate CT follow-up required.",
  "Tuberculosis:\nBilateral upper lobe cavitary lesions with surrounding infiltrates typical for active tuberculosis. Fibrotic changes and volume loss in right apex. Isolation precautions and infectious disease consultation recommended."
];

const ChatContainer = () => {
  const initialMessage: ChatMessageType = {
    id: Date.now().toString(),
    text: diagnosticMessages[Math.floor(Math.random() * diagnosticMessages.length)],
    sender: 'JamesBot',
    timestamp: new Date()
  };

  const [messages, setMessages] = useState<ChatMessageType[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const handleNewMessage = (event: CustomEvent<{ message: ChatMessageType }>) => {
      console.log('New message received:', event.detail.message);
      setMessages(prev => [...prev, event.detail.message]);
    };

    document.addEventListener('newChatMessage', handleNewMessage as EventListener);

    return () => {
      document.removeEventListener('newChatMessage', handleNewMessage as EventListener);
    };
  }, []);

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

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Chat</h2>
      <div className="h-[400px] bg-[#F1F0FB] dark:bg-background/20 rounded-lg p-4 overflow-y-auto">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}
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