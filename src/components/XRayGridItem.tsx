import React from 'react';
import MeasurementOverlay from './MeasurementOverlay';

interface XRayGridItemProps {
  img: string;
  index: number;
  currentImageIndex: number;
  activeImageIndex: number;
  position: { x: number; y: number };
  zoom: number;
  contrast: number;
  exposure: number;
  showHeatmap: boolean;
  isMeasuring: boolean;
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  isHovered: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent<HTMLImageElement>) => void;
}

const XRayGridItem = ({
  img,
  currentImageIndex,
  activeImageIndex,
  position,
  zoom,
  contrast,
  exposure,
  showHeatmap,
  isMeasuring,
  measureStart,
  measureEnd,
  measureDistance,
  isHovered,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick
}: XRayGridItemProps) => {
  const isActiveImage = currentImageIndex === activeImageIndex;
  
  const imageStyle = {
    filter: `contrast(${contrast}%) brightness(${exposure}%)`,
    transform: isHovered ? 
      `translate(${position.x}px, ${position.y}px) scale(${zoom/100})` : 
      'none',
    transition: isHovered ? 'none' : 'transform 0.2s ease-out',
    transformOrigin: '0 0'
  };

  return (
    <div 
      className="relative bg-black/20 rounded-lg overflow-hidden"
      style={{ 
        height: 'calc(35vh - 1rem)',
        maxHeight: 'calc(50vh - 2rem)'
      }}
    >
      <img
        src={img}
        alt={`X-Ray ${currentImageIndex + 1}`}
        className={`w-full h-full object-contain ${showHeatmap ? 'heatmap-filter' : ''}`}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={imageStyle}
      />
      
      {isActiveImage && isMeasuring && (
        <MeasurementOverlay
          measureStart={measureStart}
          measureEnd={measureEnd}
          measureDistance={measureDistance}
          position={position}
          zoom={zoom}
        />
      )}

      <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-sm text-white">
        {currentImageIndex + 1}
      </div>
      
      {isActiveImage && (
        <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded text-sm text-white space-x-2">
          <span>C:{Math.round(contrast)}%</span>
          <span>E:{Math.round(exposure)}%</span>
        </div>
      )}
    </div>
  );
};

export default XRayGridItem;