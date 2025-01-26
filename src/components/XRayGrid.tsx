import React, { useState } from 'react';
import XRayGridItem from './XRayGridItem';

interface XRayGridProps {
  images: string[];
  startIndex: number;
  contrast: number;
  exposure: number;
  onImageClick: (e: React.MouseEvent<HTMLImageElement>, imageIndex: number) => void;
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  showHeatmap: boolean;
  zoom: number;
  position: { x: number; y: number };
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  activeImageIndex: number;
  isMeasuring: boolean;
  measureDistance: string | null;
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
  position,
  measureStart,
  measureEnd,
  activeImageIndex,
  isMeasuring,
  measureDistance
}: XRayGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full h-full p-2 md:p-4">
      {images.slice(startIndex, startIndex + 4).map((img, index) => {
        const currentImageIndex = startIndex + index;
        
        return (
          <XRayGridItem
            key={currentImageIndex}
            img={img}
            index={index}
            currentImageIndex={currentImageIndex}
            activeImageIndex={activeImageIndex}
            position={position}
            zoom={zoom}
            contrast={contrast}
            exposure={exposure}
            showHeatmap={showHeatmap}
            isMeasuring={isMeasuring}
            measureStart={measureStart}
            measureEnd={measureEnd}
            measureDistance={measureDistance}
            isHovered={hoveredIndex === index}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={() => {
              setHoveredIndex(null);
              onMouseLeave();
            }}
            onClick={(e) => onImageClick(e, currentImageIndex)}
          />
        );
      })}
    </div>
  );
};

export default XRayGrid;