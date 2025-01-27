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

    // Wait for the next frame to ensure the canvas is mounted
    requestAnimationFrame(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match container with device pixel ratio
      const updateCanvasSize = () => {
        const container = canvas.parentElement;
        if (!container) return;
        
        const dpr = window.devicePixelRatio || 1;
        canvas.width = container.offsetWidth * dpr;
        canvas.height = container.offsetHeight * dpr;
        
        // Scale context to account for device pixel ratio
        ctx.scale(dpr, dpr);
        canvas.style.width = `${container.offsetWidth}px`;
        canvas.style.height = `${container.offsetHeight}px`;
      };

      updateCanvasSize();
      
      // Clear previous drawings
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Transform coordinates to match current image state
      const transformPoint = (point: { x: number; y: number }) => {
        const container = canvas.parentElement;
        if (!container) return point;

        return {
          x: (point.x * container.offsetWidth / 100) * (zoom / 100) + position.x,
          y: (point.y * container.offsetHeight / 100) * (zoom / 100) + position.y
        };
      };

      // Calculate transformed points
      const startPoint = transformPoint(start);
      const endPoint = transformPoint(end);

      // Draw line with anti-aliasing
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(endPoint.x, endPoint.y);
      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw endpoints
      ctx.beginPath();
      ctx.arc(startPoint.x, startPoint.y, 4, 0, Math.PI * 2);
      ctx.arc(endPoint.x, endPoint.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0EA5E9';
      ctx.fill();

      // Calculate distance in image space
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);
      
      // Position text at midpoint
      const midX = (startPoint.x + endPoint.x) / 2;
      const midY = (startPoint.y + endPoint.y) / 2;

      // Draw measurement text
      ctx.font = '14px sans-serif';
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
    });

    // Clean up function
    return () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    };
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