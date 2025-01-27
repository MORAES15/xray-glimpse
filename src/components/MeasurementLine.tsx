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
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size to match container
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Calculate actual positions considering zoom and pan
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
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw endpoints
    ctx.beginPath();
    ctx.arc(adjustedStart.x, adjustedStart.y, 4, 0, Math.PI * 2);
    ctx.arc(adjustedEnd.x, adjustedEnd.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0EA5E9';
    ctx.fill();

    // Calculate and draw measurement text
    const dx = adjustedEnd.x - adjustedStart.x;
    const dy = adjustedEnd.y - adjustedStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);
    
    // Position text at midpoint
    const midX = (adjustedStart.x + adjustedEnd.x) / 2;
    const midY = (adjustedStart.y + adjustedEnd.y) / 2;

    ctx.font = '14px sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text background
    const padding = 4;
    const text = `${distance}px`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width + padding * 2;
    const textHeight = 20;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(
      midX - textWidth / 2,
      midY - textHeight / 2,
      textWidth,
      textHeight
    );
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.fillText(text, midX, midY);
  }, [start, end, zoom, position]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full"
      style={{ zIndex: 10 }}
    />
  );
};

export default MeasurementLine;