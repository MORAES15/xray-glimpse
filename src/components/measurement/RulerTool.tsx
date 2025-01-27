import React from 'react';

interface RulerToolProps {
  start: { x: number; y: number } | null;
  end: { x: number; y: number } | null;
  distance: string | null;
  zoom: number;
}

const RulerTool = ({ start, end, distance, zoom }: RulerToolProps) => {
  if (!start || !end) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <line
          x1={`${start.x}%`}
          y1={`${start.y}%`}
          x2={`${end.x}%`}
          y2={`${end.y}%`}
          stroke="#0EA5E9"
          strokeWidth="2"
          strokeDasharray="4"
        />
        <circle
          cx={`${start.x}%`}
          cy={`${start.y}%`}
          r="4"
          fill="#0EA5E9"
        />
        <circle
          cx={`${end.x}%`}
          cy={`${end.y}%`}
          r="4"
          fill="#0EA5E9"
        />
      </svg>
      {distance && (
        <div 
          className="absolute bg-black/60 px-2 py-1 rounded text-sm text-white"
          style={{
            left: `${(start.x + end.x) / 2}%`,
            top: `${(start.y + end.y) / 2}%`,
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