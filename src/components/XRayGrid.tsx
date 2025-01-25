import React, { useState } from 'react';

interface XRayGridProps {
  images: string[];
  startIndex: number;
  contrast: number;
  exposure: number;
  onImageClick?: (e: React.MouseEvent<HTMLImageElement>, imageIndex: number) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLImageElement>, imageIndex: number) => void;
  onMouseMove?: (e: React.MouseEvent<HTMLImageElement>, imageIndex: number) => void;
  onMouseUp?: () => void;
  onMouseLeave?: () => void;
  showHeatmap?: boolean;
  zoom: number;
  position: { x: number; y: number };
  measureStart?: { x: number; y: number } | null;
  measureEnd?: { x: number; y: number } | null;
  activeImageIndex?: number;
  isMeasuring?: boolean;
  measureDistance?: string | null;
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
  const gridImages = images.slice(startIndex, startIndex + 4);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full h-full p-2 md:p-4">
      {gridImages.map((img, index) => {
        const currentImageIndex = startIndex + index;
        const isActiveImage = currentImageIndex === activeImageIndex;
        
        return (
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
              alt={`X-Ray ${currentImageIndex + 1}`}
              className={`w-full h-full object-contain ${showHeatmap ? 'heatmap-filter' : ''}`}
              onClick={(e) => onImageClick?.(e, currentImageIndex)}
              onMouseDown={(e) => onMouseDown?.(e, currentImageIndex)}
              onMouseMove={(e) => onMouseMove?.(e, currentImageIndex)}
              onMouseUp={onMouseUp}
              style={{
                filter: `contrast(${contrast}%) brightness(${exposure}%)`,
                transform: hoveredIndex === index ? 
                  `translate(${position.x}px, ${position.y}px) scale(${zoom/100})` : 
                  'none',
                transition: hoveredIndex === index ? 'none' : 'transform 0.2s ease-out'
              }}
            />
            {isActiveImage && isMeasuring && measureStart && measureEnd && (
              <>
                <svg
                  className="absolute inset-0 pointer-events-none"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    transform: hoveredIndex === index ? 
                      `translate(${position.x}px, ${position.y}px) scale(${zoom/100})` : 
                      'none'
                  }}
                >
                  <line
                    x1={`${measureStart.x}%`}
                    y1={`${measureStart.y}%`}
                    x2={`${measureEnd.x}%`}
                    y2={`${measureEnd.y}%`}
                    stroke="#0EA5E9"
                    strokeWidth="2"
                  />
                  <circle
                    cx={`${measureStart.x}%`}
                    cy={`${measureStart.y}%`}
                    r="4"
                    fill="#0EA5E9"
                  />
                  <circle
                    cx={`${measureEnd.x}%`}
                    cy={`${measureEnd.y}%`}
                    r="4"
                    fill="#0EA5E9"
                  />
                </svg>
                {measureDistance && (
                  <div 
                    className="absolute bg-black/60 px-2 py-1 rounded text-sm text-white"
                    style={{
                      left: `${(measureStart.x + measureEnd.x) / 2}%`,
                      top: `${(measureStart.y + measureEnd.y) / 2}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {measureDistance}px
                  </div>
                )}
              </>
            )}
            <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-sm text-white">
              {currentImageIndex + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default XRayGrid;