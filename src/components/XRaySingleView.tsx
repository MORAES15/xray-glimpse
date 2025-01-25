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
      {measureStart && measureEnd && (
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ 
            width: '100%', 
            height: '100%',
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
          }}
        >
          <line
            x1={`${(measureStart.x / imageRef.current!.naturalWidth) * 100}%`}
            y1={`${(measureStart.y / imageRef.current!.naturalHeight) * 100}%`}
            x2={`${(measureEnd.x / imageRef.current!.naturalWidth) * 100}%`}
            y2={`${(measureEnd.y / imageRef.current!.naturalHeight) * 100}%`}
            stroke="#0EA5E9"
            strokeWidth="2"
          />
          <circle
            cx={`${(measureStart.x / imageRef.current!.naturalWidth) * 100}%`}
            cy={`${(measureStart.y / imageRef.current!.naturalHeight) * 100}%`}
            r="4"
            fill="#0EA5E9"
          />
          <circle
            cx={`${(measureEnd.x / imageRef.current!.naturalWidth) * 100}%`}
            cy={`${(measureEnd.y / imageRef.current!.naturalHeight) * 100}%`}
            r="4"
            fill="#0EA5E9"
          />
          <text
            x={`${((measureStart.x + measureEnd.x) / (2 * imageRef.current!.naturalWidth)) * 100}%`}
            y={`${((measureStart.y + measureEnd.y) / (2 * imageRef.current!.naturalHeight)) * 100}%`}
            fill="#0EA5E9"
            fontSize="12"
            fontWeight="bold"
            dominantBaseline="central"
            textAnchor="middle"
          >
            {measureDistance}px
          </text>
        </svg>
      )}
    </div>
  );
};

export default XRaySingleView;