import React from 'react';
import { PrimaryTools, SecondaryTools } from './toolbar/ToolbarSections';
import { isDicomImage } from '../utils/dicomLoader';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface XRayToolbarProps {
  isMeasuring: boolean;
  setIsMeasuring: (value: boolean) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPosition: (value: { x: number; y: number }) => void;
  setIsDragging: (value: boolean) => void;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
  setContrast: (value: number) => void;
  setExposure: (value: number) => void;
  currentImageId?: string;
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
}: XRayToolbarProps) => {
  const isDicom = currentImageId ? isDicomImage(currentImageId) : false;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <div className="space-y-2">
          <PrimaryTools
            isMeasuring={isMeasuring}
            setIsMeasuring={setIsMeasuring}
            setZoom={setZoom}
            setPosition={setPosition}
            setIsDragging={setIsDragging}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            setContrast={setContrast}
            setExposure={setExposure}
            isDicom={isDicom}
            currentImageId={currentImageId}
          />
        </div>
        <div className="w-full h-px bg-border/30" />
        <div className="space-y-2">
          <SecondaryTools />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default XRayToolbar;