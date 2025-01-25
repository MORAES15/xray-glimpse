import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface XRayQueueProps {
  images: string[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

const XRayQueue = ({ images, currentIndex, onSelect }: XRayQueueProps) => {
  return (
    <div className="flex flex-col gap-2 w-24 glass-dark rounded-lg p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSelect(Math.max(0, currentIndex - 1))}
        disabled={currentIndex === 0}
        className="hover:bg-medical/20"
      >
        <ArrowLeft size={20} className="text-white" />
      </Button>
      
      <ScrollArea className="h-[60vh]">
        <div className="flex flex-col gap-2">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                index === currentIndex ? 'border-medical' : 'border-transparent'
              }`}
              onClick={() => onSelect(index)}
            >
              <img
                src={img}
                alt={`X-Ray ${index + 1}`}
                className="w-full h-20 object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-black/60 px-1 text-xs text-white">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSelect(Math.min(images.length - 1, currentIndex + 1))}
        disabled={currentIndex === images.length - 1}
        className="hover:bg-medical/20"
      >
        <ArrowRight size={20} className="text-white" />
      </Button>
    </div>
  );
};

export default XRayQueue;