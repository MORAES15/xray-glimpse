import React from 'react';
import { Button } from '../ui/button';
import { 
  ZoomIn, 
  Ruler, 
  Maximize, 
  Move, 
  Grid2X2,
  SlidersHorizontal
} from 'lucide-react';
import ContrastExposureControl from '../ContrastExposureControl';
import VolumetricAnalysisButton from './VolumetricAnalysisButton';
import CommentButton from './CommentButton';
import { useToast } from '../ui/use-toast';

interface ToolbarSectionProps {
  isMeasuring: boolean;
  setIsMeasuring: (value: boolean) => void;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPosition: (value: { x: number; y: number }) => void;
  setIsDragging: (value: boolean) => void;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
  setContrast: (value: number) => void;
  setExposure: (value: number) => void;
  isDicom: boolean;
  currentImageId?: string;
}

export const PrimaryTools = ({
  isMeasuring,
  setIsMeasuring,
  setZoom,
  setPosition,
  setIsDragging,
  isGridView,
  setIsGridView,
  setContrast,
  setExposure,
  isDicom,
  currentImageId
}: ToolbarSectionProps) => {
  const { toast } = useToast();

  return (
    <>
      <ContrastExposureControl 
        onContrastChange={setContrast} 
        onExposureChange={setExposure}
        isDicom={isDicom}
        imageId={currentImageId}
      />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setZoom((prev) => Math.min(200, prev + 10));
          toast({ title: "Zoom increased" });
        }}
        className="hover:bg-medical/20"
      >
        <ZoomIn size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsMeasuring(!isMeasuring);
          if (!isMeasuring) {
            toast({ title: "Click two points to measure distance" });
          }
        }}
        className={`hover:bg-medical/20 ${isMeasuring ? 'bg-medical/20' : ''}`}
      >
        <Ruler size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsDragging(false);
          toast({ title: "Pan mode activated" });
        }}
        className="hover:bg-medical/20"
      >
        <Move size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setZoom(100);
          setPosition({ x: 0, y: 0 });
          toast({ title: "Image reset to fit screen" });
        }}
        className="hover:bg-medical/20"
      >
        <Maximize size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsGridView(!isGridView);
          toast({ title: isGridView ? "Single view activated" : "Grid view activated" });
        }}
        className="hover:bg-medical/20"
      >
        <Grid2X2 size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          toast({ 
            title: isDicom ? 
              "Click and drag to adjust window/level" :
              "Click and drag with RIGHT button to adjust contrast/exposure"
          });
        }}
        className="hover:bg-medical/20"
      >
        <SlidersHorizontal size={20} className="text-white" />
      </Button>
    </>
  );
};

export const SecondaryTools = () => {
  return (
    <>
      <VolumetricAnalysisButton />
      <CommentButton />
    </>
  );
};