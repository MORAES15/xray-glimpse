import React from 'react';
import { Button } from '../ui/button';
import { ZoomIn, Ruler, Maximize, Move, Grid2X2 } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";

interface BasicToolbarButtonsProps {
  isMeasuring: boolean;
  setIsMeasuring: (value: boolean) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPosition: (value: { x: number; y: number }) => void;
  setIsDragging: (value: boolean) => void;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
}

const BasicToolbarButtons = ({
  isMeasuring,
  setIsMeasuring,
  setZoom,
  setPosition,
  setIsDragging,
  isGridView,
  setIsGridView
}: BasicToolbarButtonsProps) => {
  const { toast } = useToast();

  const tools = [
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
      isActive: isMeasuring,
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
      isActive: isGridView,
      action: () => {
        setIsGridView(!isGridView);
        toast({ title: isGridView ? "Single view activated" : "Grid view activated" });
      }
    },
  ];

  return (
    <>
      {tools.map((tool, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div>
              <Button
                variant="ghost"
                size="icon"
                onClick={tool.action}
                className={`hover:bg-medical/20 ${
                  tool.isActive ? 'bg-medical/20' : ''
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
    </>
  );
};

export default BasicToolbarButtons;