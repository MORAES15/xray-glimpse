import React from 'react';
import RulerTool from './measurement/RulerTool';

interface MeasurementOverlayProps {
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  position: { x: number; y: number };
  zoom: number;
  isGridView?: boolean;
}

const MeasurementOverlay = ({
  measureStart,
  measureEnd,
  measureDistance,
  position,
  zoom,
  isGridView = false
}: MeasurementOverlayProps) => {
  return (
    <RulerTool
      measureStart={measureStart}
      measureEnd={measureEnd}
      measureDistance={measureDistance}
      isGridView={isGridView}
    />
  );
};

export default MeasurementOverlay;