import React from 'react';
import { Button } from './ui/button';
import { 
  ZoomIn, 
  Ruler, 
  Maximize, 
  Move, 
  Grid2X2,
  Printer,
  Share2,
  FileExport,
  Database,
  Network,
  Server,
  AlertCircle
} from 'lucide-react';
import ContrastExposureControl from './ContrastExposureControl';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
        setIsDragging(false);
        toast({ title: "Pan mode activated" });
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
    { 
      icon: <Printer size={20} className="text-white" />, 
      name: 'Print', 
      action: () => {
        window.print();
        toast({ title: "Printing..." });
      }
    },
    { 
      icon: <Share2 size={20} className="text-white" />, 
      name: 'Share', 
      action: () => {
        toast({ title: "Share feature coming soon" });
      }
    },
    { 
      icon: <FileExport size={20} className="text-white" />, 
      name: 'Export DICOM', 
      action: () => {
        toast({ title: "DICOM export feature coming soon" });
      }
    },
    { 
      icon: <Database size={20} className="text-white" />, 
      name: 'Export Data', 
      action: () => {
        toast({ title: "Data export feature coming soon" });
      }
    },
    { 
      icon: <Network size={20} className="text-white" />, 
      name: 'Connect Network', 
      action: () => {
        toast({ title: "Network connection feature coming soon" });
      }
    },
    { 
      icon: <Server size={20} className="text-white" />, 
      name: 'Connect PACS', 
      action: () => {
        toast({ title: "PACS connection feature coming soon" });
      }
    },
    { 
      icon: <AlertCircle size={20} className="text-white" />, 
      name: 'Report Problem', 
      action: () => {
        toast({ title: "Problem report feature coming soon" });
      }
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn fixed left-4 top-1/2 -translate-y-1/2 z-50">
        {tools.map((tool, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={tool.action}
                  className={`hover:bg-medical/20 ${
                    (tool.name === 'Measure' && isMeasuring) ? 'bg-medical/20' : ''
                  }`}
                >
                  {tool.icon}
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