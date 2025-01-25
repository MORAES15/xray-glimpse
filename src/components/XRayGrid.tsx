import React from 'react';

interface XRayGridProps {
  images: string[];
  startIndex: number;
  contrast: number;
  exposure: number;
  onImageClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  showHeatmap?: boolean;
  zoom: number;
  position: { x: number; y: number };
}

const XRayGrid = ({
  images,
  startIndex,
  contrast,
  exposure,
  onImageClick,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  showHeatmap,
  zoom,
  position
}: XRayGridProps) => {
  const gridImages = images.slice(startIndex, startIndex + 4);
  
  return (
    <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
      {gridImages.map((img, index) => (
        <div 
          key={index} 
          className="relative aspect-square bg-black/20 rounded-lg overflow-hidden"
          style={{ height: '35vh' }}
        >
          <img
            src={img}
            alt={`X-Ray ${startIndex + index + 1}`}
            className={`w-full h-full object-contain ${showHeatmap ? 'heatmap-filter' : ''}`}
            onClick={onImageClick}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            style={{
              filter: `contrast(${contrast}%) brightness(${exposure}%)`,
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
            }}
          />
          <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-sm text-white">
            {startIndex + index + 1}
          </div>
        </div>
      ))}
    </div>
  );
};

export default XRayGrid;