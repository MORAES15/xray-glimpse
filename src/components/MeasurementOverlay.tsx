import React from 'react';
import RulerTool from './measurement/RulerTool';

interface MeasurementOverlayProps {
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  position: { x: number; y: number };
  zoom: number;
}

const MeasurementOverlay = ({
  measureStart,
  measureEnd,
  measureDistance,
  position,
  zoom
}: MeasurementOverlayProps) => {
  if (!measureStart || !measureEnd) return null;

  return (
    <RulerTool
      start={measureStart}
      end={measureEnd}
      distance={measureDistance}
      zoom={zoom}
    />
  );
};

export default MeasurementOverlay;