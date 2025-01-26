import React from 'react';
import { Button } from './ui/button';
import { Ruler, ZoomIn, ZoomOut, Grid, Contrast, RotateCcw } from 'lucide-react';

export interface XRayToolbarProps {
  isMeasuring: boolean;
  setIsMeasuring: (value: boolean) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  isGridView: boolean;
  setIsGridView: React.Dispatch<React.SetStateAction<boolean>>;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  setExposure: React.Dispatch<React.SetStateAction<number>>;
  currentImageId?: string;
}

const XRayToolbar: React.FC<XRayToolbarProps> = ({
  isMeasuring,
  setIsMeasuring,
  setZoom,
  setPosition,
  setIsDragging,
  isGridView,
  setIsGridView,
  setContrast,
  setExposure,
  currentImageId
}) => {
  const handleReset = () => {
    setZoom(100);
    setPosition({ x: 0, y: 0 });
    setContrast(100);
    setExposure(100);
  };

  return (
    <div className="flex flex-col gap-2 bg-black/80 p-2 rounded-lg">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMeasuring(!isMeasuring)}
        className={`${isMeasuring ? 'bg-blue-500/50' : ''}`}
      >
        <Ruler className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setZoom(prev => Math.min(prev + 10, 200))}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setZoom(prev => Math.max(prev - 10, 50))}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsGridView(!isGridView)}
        className={`${isGridView ? 'bg-blue-500/50' : ''}`}
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setContrast(prev => prev + 10)}
      >
        <Contrast className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleReset}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default XRayToolbar;