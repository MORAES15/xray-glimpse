import React from 'react';

interface MeasurementLineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

const MeasurementLine = ({ start, end }: MeasurementLineProps) => {
  return (
    <>
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
    </>
  );
};

export default MeasurementLine;