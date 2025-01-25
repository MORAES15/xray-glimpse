import React from 'react';
import { Button } from './ui/button';
import { Ruler, Move, Grid2X2 } from 'lucide-react';
import ContrastExposureControl from './ContrastExposureControl';
import { useToast } from './ui/use-toast';

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
  setExposure
}: XRayToolbarProps) => {
  const { toast } = useToast();

  const tools = [
    { 
      icon: <ContrastExposureControl 
        onContrastChange={setContrast} 
        onExposureChange={setExposure} 
      />, 
      name: 'Contrast/Exposure',
      action: () => {
        toast({ 
          title: "Use RIGHT mouse button and drag to adjust contrast/exposure"
        });
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
        <div key={index}>
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
        </div>
      ))}
    </div>
  );
};

export default XRayToolbar;