import React, { useRef } from 'react';

interface XRaySingleViewProps {
  image: string;
  contrast: number;
  exposure: number;
  showHeatmap: boolean;
  zoom: number;
  position: { x: number; y: number };
  isDragging: boolean;
  isMeasuring: boolean;
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

const XRaySingleView = ({
  image,
  contrast,
  exposure,
  showHeatmap,
  zoom,
  position,
  isMeasuring,
  measureStart,
  measureEnd,
  measureDistance,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave
}: XRaySingleViewProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const getAdjustedCoordinates = (x: number, y: number) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = imageRef.current.naturalWidth / rect.width;
    const scaleY = imageRef.current.naturalHeight / rect.height;
    
    // Adjust for position offset and zoom
    const adjustedX = (x - rect.left - position.x) / (zoom / 100);
    const adjustedY = (y - rect.top - position.y) / (zoom / 100);
    
    return {
      x: adjustedX * scaleX,
      y: adjustedY * scaleY
    };
  };

  let adjustedStart = measureStart;
  let adjustedEnd = measureEnd;

  if (imageRef.current && measureStart && measureEnd) {
    adjustedStart = getAdjustedCoordinates(measureStart.x, measureStart.y);
    adjustedEnd = getAdjustedCoordinates(measureEnd.x, measureEnd.y);
  }

  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center">
      <img 
        ref={imageRef}
        src={image} 
        alt="X-Ray"
        className={`h-full w-full object-contain cursor-move ${showHeatmap ? 'heatmap-filter' : ''}`}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        style={{
          filter: `contrast(${contrast}%) brightness(${exposure}%)`,
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
        }}
      />
      {isMeasuring && measureStart && measureEnd && imageRef.current && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ 
            width: '100%', 
            height: '100%',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
          }}
        >
          <line
            x1={`${(adjustedStart.x / imageRef.current.naturalWidth) * 100}%`}
            y1={`${(adjustedStart.y / imageRef.current.naturalHeight) * 100}%`}
            x2={`${(adjustedEnd.x / imageRef.current.naturalWidth) * 100}%`}
            y2={`${(adjustedEnd.y / imageRef.current.naturalHeight) * 100}%`}
            stroke="#0EA5E9"
            strokeWidth="2"
          />
          <circle
            cx={`${(adjustedStart.x / imageRef.current.naturalWidth) * 100}%`}
            cy={`${(adjustedStart.y / imageRef.current.naturalHeight) * 100}%`}
            r="4"
            fill="#0EA5E9"
          />
          <circle
            cx={`${(adjustedEnd.x / imageRef.current.naturalWidth) * 100}%`}
            cy={`${(adjustedEnd.y / imageRef.current.naturalHeight) * 100}%`}
            r="4"
            fill="#0EA5E9"
          />
          {measureDistance && (
            <text
              x={`${((adjustedStart.x + adjustedEnd.x) / (2 * imageRef.current.naturalWidth)) * 100}%`}
              y={`${((adjustedStart.y + adjustedEnd.y) / (2 * imageRef.current.naturalHeight)) * 100}%`}
              fill="#0EA5E9"
              fontSize="12"
              fontWeight="bold"
              dominantBaseline="central"
              textAnchor="middle"
            >
              {measureDistance}
            </text>
          )}
        </svg>
      )}
    </div>
  );
};

export default XRaySingleView;
