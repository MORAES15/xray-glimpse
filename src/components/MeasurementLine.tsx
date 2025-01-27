import React from 'react';

interface MeasurementLineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  zoom: number;
  position: { x: number; y: number };
}

const MeasurementLine = ({ start, end, zoom, position }: MeasurementLineProps) => {
  // Adjust coordinates based on zoom and position
  const adjustedStart = {
    x: (start.x + (position.x / zoom)) * (zoom / 100),
    y: (start.y + (position.y / zoom)) * (zoom / 100)
  };

  const adjustedEnd = {
    x: (end.x + (position.x / zoom)) * (zoom / 100),
    y: (end.y + (position.y / zoom)) * (zoom / 100)
  };

  return (
    <>
      <line
        x1={`${adjustedStart.x}%`}
        y1={`${adjustedStart.y}%`}
        x2={`${adjustedEnd.x}%`}
        y2={`${adjustedEnd.y}%`}
        stroke="#0EA5E9"
        strokeWidth="2"
        strokeDasharray="4"
        className="measurement-line"
      />
      <circle
        cx={`${adjustedStart.x}%`}
        cy={`${adjustedStart.y}%`}
        r="4"
        fill="#0EA5E9"
        className="measurement-point"
      />
      <circle
        cx={`${adjustedEnd.x}%`}
        cy={`${adjustedEnd.y}%`}
        r="4"
        fill="#0EA5E9"
        className="measurement-point"
      />
    </>
  );
};

export default MeasurementLine;