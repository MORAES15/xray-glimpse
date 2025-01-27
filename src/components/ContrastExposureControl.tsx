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
        const element = document.querySelector('.dicom-image');
        if (element) {
          const viewport = cornerstone.getViewport(element);
          if (viewport) {
            viewport.voi.windowWidth = Math.max(1, viewport.voi.windowWidth + deltaX);
            viewport.voi.windowCenter = viewport.voi.windowCenter + deltaY;
            cornerstone.setViewport(element, viewport);
          }
        }
      } catch (error) {
        console.error('Error adjusting DICOM window/level:', error);
      }
    } else {
      onContrastChange(deltaX);
      onExposureChange(deltaY);
    }
  }, [startPos, onContrastChange, onExposureChange, isDicom, imageId]);

  const handleMouseUp = useCallback(() => {
    setIsAdjusting(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const startAdjusting = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdjusting(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    toast({
      title: isDicom ? "Adjusting Window/Level" : "Adjusting Contrast/Exposure",
      description: "Move mouse horizontally for contrast, vertically for exposure",
    });
  };

  return (
    <div
      onContextMenu={startAdjusting}
      className={`hover:bg-medical/20 ${isAdjusting ? 'bg-medical/20' : ''}`}
    >
      <Button
        variant="ghost"
        size="icon"
        title={isDicom ? "Right-click to adjust Window/Level" : "Right-click to adjust Contrast/Exposure"}
      >
        <SunDim size={20} className="text-white" />
      </Button>
    </div>
  );
};

export default ContrastExposureControl;