import React from 'react';
import XRayControlPanel from '../XRayControlPanel';
import XRayToolbar from '../XRayToolbar';

interface ViewerControlsProps {
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  showHeatmap: boolean;
  setShowHeatmap: React.Dispatch<React.SetStateAction<boolean>>;
  isMeasuring: boolean;
  setIsMeasuring: (value: boolean) => void;
  setPosition: (value: { x: number; y: number }) => void;
  setIsDragging: (value: boolean) => void;
  isGridView: boolean;
  setIsGridView: (value: boolean) => void;
  setContrast: (value: number) => void;
  setExposure: (value: number) => void;
  currentImageId?: string;
  onExportImage: () => void;
}

const ViewerControls = ({
  zoom,
  setZoom,
  showHeatmap,
  setShowHeatmap,
  isMeasuring,
  setIsMeasuring,
  setPosition,
  setIsDragging,
  isGridView,
  setIsGridView,
  setContrast,
  setExposure,
  currentImageId,
  onExportImage
}: ViewerControlsProps) => {
  return (
    <>
      <XRayToolbar
        isMeasuring={isMeasuring}
        setIsMeasuring={setIsMeasuring}
        setZoom={setZoom}
        setPosition={setPosition}
        setIsDragging={setIsDragging}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        setContrast={setContrast}
        setExposure={setExposure}
        currentImageId={currentImageId}
        onExportImage={onExportImage}
      />
      <div className="flex gap-4">
        <XRayControlPanel
          zoom={zoom}
          setZoom={setZoom}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          onFileUpload={() => {}}
        />
      </div>
    </>
  );
};

export default ViewerControls;