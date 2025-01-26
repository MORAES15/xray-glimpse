import React from 'react';
import MeasurementLine from './MeasurementLine';

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

  const overlayStyle = {
    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`,
    transformOrigin: '0 0'
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={overlayStyle}>
      <svg
        className="absolute inset-0 measurement-overlay"
        style={{ width: '100%', height: '100%' }}
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

export default MeasurementOverlay;