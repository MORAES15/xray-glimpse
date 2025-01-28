import React from 'react';
import { Button } from './ui/button';
import { 
  ZoomIn, 
  Ruler, 
  Maximize, 
  Move, 
  Grid2X2,
  Box3d,
  PenTool,
  MessageSquare
} from 'lucide-react';
import ContrastExposureControl from './ContrastExposureControl';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "./ui/tooltip";
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
  isPanning: boolean;
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
      icon: <ZoomIn className="text-white transition-colors" />, 
      name: 'Zoom', 
      action: () => {
        setZoom((prev) => Math.min(200, prev + 10));
        toast({ title: "Zoom increased" });
      }
    },
    { 
      icon: <Ruler className="text-white transition-colors" />, 
      name: 'Measure',
      isActive: isMeasuring,
      action: () => {
        setIsMeasuring(!isMeasuring);
        if (!isMeasuring) {
          toast({ title: "Click two points to measure distance" });
        }
      }
    },
    { 
      icon: <Move className="text-white transition-colors" />, 
      name: 'Pan',
      isActive: isPanning,
      action: () => {
        setIsDragging(!isPanning);
        toast({ title: isPanning ? "Pan mode deactivated" : "Pan mode activated" });
      }
    },
    { 
      icon: <Maximize className="text-white transition-colors" />, 
      name: 'Fit Screen', 
      action: () => {
        setZoom(100);
        setPosition({ x: 0, y: 0 });
        toast({ title: "Image reset to fit screen" });
      }
    },
    { 
      icon: <Grid2X2 className="text-white transition-colors" />, 
      name: 'Grid View',
      isActive: isGridView,
      action: () => {
        setIsGridView(!isGridView);
        toast({ title: isGridView ? "Single view activated" : "Grid view activated" });
      }
    },
    { 
      icon: <Box3d className="text-white transition-colors" />, 
      name: '3D Reconstruction',
      action: () => {
        toast({ title: "3D reconstruction initiated" });
      }
    },
    { 
      icon: <PenTool className="text-white transition-colors" />, 
      name: 'Annotation',
      action: () => {
        toast({ title: "Annotation tool activated" });
      }
    },
    { 
      icon: <MessageSquare className="text-white transition-colors" />, 
      name: 'Comments',
      action: () => {
        toast({ title: "Comments panel opened" });
      }
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn">
        {tools.map((tool, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={tool.action}
                  className={`
                    relative
                    hover:bg-medical/20 
                    transition-all duration-200
                    ${tool.isActive ? 
                      'bg-medical/30 shadow-[0_0_10px_rgba(14,165,233,0.3)] ring-1 ring-medical/50 [&_svg]:text-medical' : 
                      ''
                    }
                  `}
                >
                  {tool.icon}
                  {tool.isActive && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-medical rounded-full animate-pulse" />
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-black/80 text-white border-none px-3 py-1.5">
              <p>{tool.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default XRayToolbar;