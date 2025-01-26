import React from 'react';
import { Button } from './ui/button';
import { ZoomIn, Ruler, Maximize, Move, Grid2X2 } from 'lucide-react';
import ContrastExposureControl from './ContrastExposureControl';
import { useToast } from './ui/use-toast';
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
  currentImageId
}: XRayToolbarProps) => {
  const { toast } = useToast();
  const isDicom = currentImageId ? isDicomImage(currentImageId) : false;

  const tools = [
    { 
      icon: <ContrastExposureControl 
        onContrastChange={setContrast} 
        onExposureChange={setExposure}
        isDicom={isDicom}
        imageId={currentImageId}
      />, 
      name: isDicom ? 'Window/Level' : 'Contrast/Exposure',
      action: () => {
        toast({ 
          title: isDicom ? 
            "Click and drag to adjust window/level" :
            "Click and drag with RIGHT button to adjust contrast/exposure"
        });
      }
    },
    { 
      icon: <ZoomIn size={20} className="text-white" />, 
      name: 'Zoom', 
      action: () => {
        setZoom((prev) => Math.min(200, prev + 10));
        toast({ title: "Zoom increased" });
      }
    },
    { 
      icon: <Ruler size={20} className="text-white" />, 
      name: 'Measure', 
      action: () => {
        setIsMeasuring(!isMeasuring);
        if (!isMeasuring) {
          toast({ title: "Click two points to measure distance" });
        }
      }
    },
    { 
      icon: <Move size={20} className="text-white" />, 
      name: 'Pan', 
      action: () => {
        setIsDragging(true);
        toast({ title: "Pan mode activated - Click and drag to move the image" });
      }
    },
    { 
      icon: <Maximize size={20} className="text-white" />, 
      name: 'Fit Screen', 
      action: () => {
        setZoom(100);
        setPosition({ x: 0, y: 0 });
        toast({ title: "Image reset to fit screen" });
      }
    },
    { 
      icon: <Grid2X2 size={20} className="text-white" />, 
      name: 'Grid View', 
      action: () => {
        setIsGridView(!isGridView);
        toast({ title: isGridView ? "Single view activated" : "Grid view activated" });
      }
    },
  ];

  return (
    <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn">
      {tools.map((tool, index) => (
        <div key={index} className="relative group">
          <Button
            variant="ghost"
            size="icon"
            onClick={tool.action}
            className={`hover:bg-medical/20 ${
              (tool.name === 'Measure' && isMeasuring) ? 'bg-medical/20' : ''
            }`}
            title={tool.name}
          >
            {tool.icon}
          </Button>
          <span className="absolute left-full ml-2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {tool.name}
          </span>
        </div>
      ))}
    </div>
  );
};

export default XRayToolbar;