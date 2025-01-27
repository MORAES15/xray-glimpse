import React from 'react';

interface RulerToolProps {
  start: { x: number; y: number } | null;
  end: { x: number; y: number } | null;
  distance: string | null;
  zoom: number;
}

const RulerTool = ({ start, end, distance, zoom }: RulerToolProps) => {
  if (!start || !end) return null;

  // Adjust coordinates based on zoom
  const adjustedStart = {
    x: (start.x * 100) / zoom,
    y: (start.y * 100) / zoom
  };

  const adjustedEnd = {
    x: (end.x * 100) / zoom,
    y: (end.y * 100) / zoom
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full measurement-overlay"
        preserveAspectRatio="none"
      >
        <line
          x1={`${adjustedStart.x}%`}
          y1={`${adjustedStart.y}%`}
          x2={`${adjustedEnd.x}%`}
          y2={`${adjustedEnd.y}%`}
          stroke="#0EA5E9"
          strokeWidth="2"
          strokeDasharray="4"
        />
        <circle
          cx={`${adjustedStart.x}%`}
          cy={`${adjustedStart.y}%`}
          r="4"
          fill="#0EA5E9"
        />
        <circle
          cx={`${adjustedEnd.x}%`}
          cy={`${adjustedEnd.y}%`}
          r="4"
          fill="#0EA5E9"
        />
      </svg>
      {distance && (
        <div 
          className="absolute bg-black/60 px-2 py-1 rounded text-sm text-white"
          style={{
            left: `${(adjustedStart.x + adjustedEnd.x) / 2}%`,
            top: `${(adjustedStart.y + adjustedEnd.y) / 2}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {distance}px
        </div>
      )}
    </div>
  );
};

export default RulerTool;