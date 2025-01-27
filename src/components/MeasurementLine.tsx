import React, { useEffect, useRef } from 'react';

interface MeasurementLineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  zoom: number;
  position: { x: number; y: number };
}

const MeasurementLine = ({ start, end, zoom, position }: MeasurementLineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !start || !end) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 2;
    ctx.setLineDash([4]);

    // Calculate adjusted coordinates
    const adjustedStart = {
      x: (start.x * canvas.width / 100) + (position.x / zoom),
      y: (start.y * canvas.height / 100) + (position.y / zoom)
    };

    const adjustedEnd = {
      x: (end.x * canvas.width / 100) + (position.x / zoom),
      y: (end.y * canvas.height / 100) + (position.y / zoom)
    };

    // Draw line
    ctx.beginPath();
    ctx.moveTo(adjustedStart.x, adjustedStart.y);
    ctx.lineTo(adjustedEnd.x, adjustedEnd.y);
    ctx.stroke();

    // Draw endpoints
    ctx.setLineDash([]);
    ctx.fillStyle = '#0EA5E9';
    ctx.beginPath();
    ctx.arc(adjustedStart.x, adjustedStart.y, 4, 0, Math.PI * 2);
    ctx.arc(adjustedEnd.x, adjustedEnd.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw measurement text
    const midX = (adjustedStart.x + adjustedEnd.x) / 2;
    const midY = (adjustedStart.y + adjustedEnd.y) / 2;
    const distance = Math.sqrt(
      Math.pow(adjustedEnd.x - adjustedStart.x, 2) +
      Math.pow(adjustedEnd.y - adjustedStart.y, 2)
    ).toFixed(2);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#0EA5E9';
    ctx.fillText(`${distance}px`, midX + 5, midY - 5);
  }, [start, end, zoom, position]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default MeasurementLine;