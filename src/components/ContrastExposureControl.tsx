import React, { useState, useCallback } from 'react';
import { SunDim } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface ContrastExposureControlProps {
  onContrastChange: (value: number) => void;
  onExposureChange: (value: number) => void;
}

const ContrastExposureControl = ({ onContrastChange, onExposureChange }: ContrastExposureControlProps) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = (e.clientX - startPos.x) / 2;
    const deltaY = (startPos.y - e.clientY) / 2;
    
    onContrastChange(100 + deltaX);
    onExposureChange(100 + deltaY);
  }, [startPos, onContrastChange, onExposureChange]);

  const handleMouseUp = useCallback(() => {
    setIsAdjusting(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const startAdjusting = (e: React.MouseEvent) => {
    setIsAdjusting(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    toast({
      title: "Adjusting Contrast/Exposure",
      description: "Move mouse horizontally for contrast, vertically for exposure",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startAdjusting}
      className={`hover:bg-medical/20 ${isAdjusting ? 'bg-medical/20' : ''}`}
      title="Adjust Contrast/Exposure"
    >
      <SunDim size={20} className="text-white" />
    </Button>
  );
};

export default ContrastExposureControl;