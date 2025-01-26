import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { useToast } from './ui/use-toast';

interface Prediction {
  label: string;
  confidence: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  predictions?: Prediction[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const generateLLMResponse = async (predictions: Prediction[]) => {
    try {
      // Format predictions for LLM input
      const formattedPredictions = predictions
        .map(p => `${p.label}: ${(p.confidence * 100).toFixed(1)}%`)
        .join(', ');

      // Template for medical interpretation
      const prompt = `Based on the X-ray analysis showing: ${formattedPredictions}, 
        provide a 2-3 sentence medical interpretation focusing on key findings and confidence levels. 
        Use professional medical terminology.`;

      // TODO: Replace with actual LLM API call
      // Simulated response for now
      return new Promise<string>(resolve => {
        setTimeout(() => {
          const primaryPrediction = predictions[0];
          resolve(
            `Analysis indicates presence of ${primaryPrediction.label} with ${
              primaryPrediction.confidence > 0.8 ? 'high' : 'moderate'
            } confidence (${(primaryPrediction.confidence * 100).toFixed(1)}%). ${
              predictions.length > 1
                ? `Additional findings include ${predictions
                    .slice(1)
                    .map(
                      p =>
                        `${p.label} (${(p.confidence * 100).toFixed(1)}%)`
                    )
                    .join(', ')}.`
                : ''
            } Recommend clinical correlation and follow-up as appropriate.`
          );
        }, 1000);
      });
    } catch (error) {
      console.error('Error generating LLM response:', error);
      throw new Error('Failed to generate analysis. Please try again.');
    }
  };

  const handleSend = async () => {
    if (inputText.trim()) {
      setIsProcessing(true);
      try {
        // Add user message
        const userMessage: Message = {
          id: Date.now(),
          text: inputText,
          sender: 'user'
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');

        // Simulate predictions (replace with actual model predictions)
        const mockPredictions: Prediction[] = [
          { label: 'pneumonia', confidence: 0.92 },
          { label: 'infiltration', confidence: 0.73 },
          { label: 'normal', confidence: 0.12 }
        ];

        // Generate LLM response
        const llmResponse = await generateLLMResponse(mockPredictions);

        // Add AI response
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: llmResponse,
          sender: 'ai',
          predictions: mockPredictions
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'An error occurred',
          variant: 'destructive'
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 z-50">
      <Button 
        variant="outline" 
        className="mb-2 ml-auto block"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Close Analysis' : 'Open Analysis'}
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
                {message.predictions && (
                  <div className="mt-2 text-xs opacity-75">
                    {message.predictions.map((pred, index) => (
                      <div key={index}>
                        {pred.label}: {(pred.confidence * 100).toFixed(1)}%
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the analysis..."
                className="flex-1"
                disabled={isProcessing}
              />
              <Button 
                onClick={handleSend} 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Send'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;