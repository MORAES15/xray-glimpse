import React from 'react';
import DicomViewer from './DicomViewer';
import { isDicomImage } from '../utils/dicomLoader';
import MeasurementOverlay from './MeasurementOverlay';

interface ImageDisplayProps {
  imageUrl: string;
  contrast: number;
  exposure: number;
  position: { x: number; y: number };
  zoom: number;
  showHeatmap: boolean;
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  isMeasuring: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent<HTMLImageElement>) => void;
}

const ImageDisplay = ({
  imageUrl,
  contrast,
  exposure,
  position,
  zoom,
  showHeatmap,
  measureStart,
  measureEnd,
  measureDistance,
  isMeasuring,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick
}: ImageDisplayProps) => {
  if (isDicomImage(imageUrl)) {
    return (
      <DicomViewer
        imageId={imageUrl}
        position={position}
        zoom={zoom}
      />
    );
  }

  return (
    <div className="image-container relative">
      <img 
        src={imageUrl} 
        alt="X-Ray"
        className={`h-full w-full object-contain cursor-move ${showHeatmap ? 'heatmap-filter' : ''}`}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        style={{
          filter: `contrast(${contrast}%) brightness(${exposure}%)`,
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
        }}
      />
      <MeasurementOverlay
        measureStart={measureStart}
        measureEnd={measureEnd}
        measureDistance={measureDistance}
        position={position}
        zoom={zoom}
      />
    </div>
  );
};

export default ImageDisplay;