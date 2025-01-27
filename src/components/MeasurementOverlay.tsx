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
  isHovered = true
}: MeasurementOverlayProps) => {
  if (!measureStart || !measureEnd) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <MeasurementLine 
        start={measureStart} 
        end={measureEnd} 
        zoom={zoom}
        position={position}
      />
    </div>
  );
};

export default MeasurementOverlay;