import React from 'react';
import { TooltipProvider } from "./ui/tooltip";
import ContrastExposureControl from './ContrastExposureControl';
import BasicToolbarButtons from './toolbar/BasicToolbarButtons';
import AdvancedToolbarButtons from './toolbar/AdvancedToolbarButtons';
import { isDicomImage } from '../utils/dicomLoader';

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
  onExportImage: () => void;
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
  onExportImage
}: XRayToolbarProps) => {
  const isDicom = currentImageId ? isDicomImage(currentImageId) : false;

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <ContrastExposureControl 
          onContrastChange={setContrast} 
          onExposureChange={setExposure}
          isDicom={isDicom}
          imageId={currentImageId}
        />
        
        <BasicToolbarButtons
          isMeasuring={isMeasuring}
          setIsMeasuring={setIsMeasuring}
          setZoom={setZoom}
          setPosition={setPosition}
          setIsDragging={setIsDragging}
          isGridView={isGridView}
          setIsGridView={setIsGridView}
        />
        
        <div className="w-full h-px bg-border/30" />
        
        <AdvancedToolbarButtons onExportImage={onExportImage} />
      </div>
    </TooltipProvider>
  );
};

export default XRayToolbar;