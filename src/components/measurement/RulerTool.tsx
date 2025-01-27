import React from 'react';
import MeasurementLine from '../MeasurementLine';

interface RulerToolProps {
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  isGridView: boolean;
}

const RulerTool = ({ measureStart, measureEnd, measureDistance, isGridView }: RulerToolProps) => {
  if (!measureStart || !measureEnd) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <MeasurementLine start={measureStart} end={measureEnd} />
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

export default RulerTool;