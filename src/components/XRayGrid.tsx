import React, { useState } from 'react';

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full h-full p-2 md:p-4">
      {gridImages.map((img, index) => (
        <div 
          key={index} 
          className="relative bg-black/20 rounded-lg overflow-hidden"
          style={{ 
            height: 'calc(35vh - 1rem)',
            maxHeight: 'calc(50vh - 2rem)'
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => {
            setHoveredIndex(null);
            onMouseLeave?.();
          }}
        >
          <img
            src={img}
            alt={`X-Ray ${startIndex + index + 1}`}
            className={`w-full h-full object-contain ${showHeatmap ? 'heatmap-filter' : ''}`}
            onClick={(e) => hoveredIndex === index && onImageClick?.(e)}
            onMouseDown={(e) => hoveredIndex === index && onMouseDown?.(e)}
            onMouseMove={(e) => hoveredIndex === index && onMouseMove?.(e)}
            onMouseUp={() => hoveredIndex === index && onMouseUp?.()}
            style={{
              filter: `contrast(${contrast}%) brightness(${exposure}%)`,
              transform: hoveredIndex === index ? 
                `translate(${position.x}px, ${position.y}px) scale(${zoom/100})` : 
                'none',
              transition: hoveredIndex === index ? 'none' : 'transform 0.2s ease-out'
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