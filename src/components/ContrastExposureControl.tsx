import React, { useState, useCallback } from 'react';
import { SunDim } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import * as cornerstone from 'cornerstone-core';

interface ContrastExposureControlProps {
  onContrastChange: (value: number) => void;
  onExposureChange: (value: number) => void;
  isDicom?: boolean;
  imageId?: string;
}

const ContrastExposureControl = ({ 
  onContrastChange, 
  onExposureChange,
  isDicom,
  imageId 
}: ContrastExposureControlProps) => {
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const deltaX = (e.clientX - startPos.x) / 2;
    const deltaY = (startPos.y - e.clientY) / 2;
    
    if (isDicom && imageId) {
      try {
        const image = cornerstone.imageCache.imageCache[imageId]?.image;
        if (image) {
          const viewport = cornerstone.getDefaultViewportForImage(document.body, image);
          if (viewport) {
            viewport.voi.windowWidth = Math.max(1, viewport.voi.windowWidth + deltaX);
            viewport.voi.windowCenter = viewport.voi.windowCenter + deltaY;
            cornerstone.setViewport(document.body, viewport);
          }
        }
      } catch (error) {
        console.error('Error adjusting DICOM window/level:', error);
      }
    } else {
      onContrastChange(100 + deltaX);
      onExposureChange(100 + deltaY);
    }
  }, [startPos, onContrastChange, onExposureChange, isDicom, imageId]);

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
      title: isDicom ? "Adjusting Window/Level" : "Adjusting Contrast/Exposure",
      description: "Move mouse horizontally for width, vertically for center",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={startAdjusting}
      className={`hover:bg-medical/20 ${isAdjusting ? 'bg-medical/20' : ''}`}
      title={isDicom ? "Adjust Window/Level" : "Adjust Contrast/Exposure"}
    >
      <SunDim size={20} className="text-white" />
    </Button>
  );
};

export default ContrastExposureControl;