import React from 'react';
import MeasurementLine from './MeasurementLine';

interface MeasurementOverlayProps {
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  position: { x: number; y: number };
  zoom: number;
  isHovered?: boolean;
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
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 measurement-overlay w-full h-full"
        preserveAspectRatio="none"
      >
        <MeasurementLine 
          start={measureStart} 
          end={measureEnd} 
          zoom={zoom}
          position={position}
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