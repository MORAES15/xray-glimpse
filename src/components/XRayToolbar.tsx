import React from 'react';
import { Button } from './ui/button';
import { 
  ZoomIn, ZoomOut, Move, Grid3X3, 
  SunMedium, Contrast, Video, Ruler
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface XRayToolbarProps {
  isMeasuring: boolean;
  setIsMeasuring: (value: boolean) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPosition: (value: { x: number; y: number }) => void;
  setIsDragging: (value: boolean) => void;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
  setContrast: React.Dispatch<React.SetStateAction<number>>;
  setExposure: React.Dispatch<React.SetStateAction<number>>;
  currentImageId: string;
  isPanning: boolean;
  onToggleRecording: () => void;
}

const XRayToolbar = ({
  isMeasuring,
  setIsMeasuring,
  setZoom,
  setPosition,
  setIsDragging,
  isGridView,
  setIsGridView,
  setContrast,
  setExposure,
  currentImageId,
  isPanning,
  onToggleRecording
}: XRayToolbarProps) => {
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 10));
  const handleMove = () => setIsDragging(true);
  const handleGridView = () => setIsGridView(!isGridView);
  const handleContrastChange = () => setContrast(prev => prev + 10);
  const handleExposureChange = () => setExposure(prev => prev + 10);

  return (
    <div className="flex flex-col gap-2 bg-black/90 rounded-lg p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMeasuring(!isMeasuring)}
              className={`hover:bg-white/10 ${isMeasuring ? 'bg-white/20' : ''}`}
            >
              <Ruler className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Measurement Tool</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="hover:bg-white/10"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="hover:bg-white/10"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMove}
              className="hover:bg-white/10"
            >
              <Move className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Move</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGridView}
              className="hover:bg-white/10"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Grid View</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleContrastChange}
              className="hover:bg-white/10"
            >
              <Contrast className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Increase Contrast</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExposureChange}
              className="hover:bg-white/10"
            >
              <SunMedium className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Increase Exposure</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleRecording}
              className="hover:bg-white/10"
            >
              <Video className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Screen Recording</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default XRayToolbar;
