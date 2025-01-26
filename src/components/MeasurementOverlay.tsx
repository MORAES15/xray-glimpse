import React from 'react';

interface MeasurementOverlayProps {
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  position: { x: number; y: number };
  zoom: number;
  isHovered: boolean;
}

const MeasurementOverlay = ({
  measureStart,
  measureEnd,
  measureDistance,
  position,
  zoom,
  isHovered
}: MeasurementOverlayProps) => {
  if (!measureStart || !measureEnd) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        transform: isHovered ? 
          `translate(${position.x}px, ${position.y}px) scale(${zoom/100})` : 
          'none'
      }}
    >
      <svg
        className="absolute inset-0 measurement-overlay"
        style={{ width: '100%', height: '100%' }}
        preserveAspectRatio="none"
      >
        <line
          x1={`${measureStart.x}%`}
          y1={`${measureStart.y}%`}
          x2={`${measureEnd.x}%`}
          y2={`${measureEnd.y}%`}
          stroke="#0EA5E9"
          strokeWidth="2"
          strokeDasharray="4"
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
    </div>
  );
};

export default MeasurementOverlay;