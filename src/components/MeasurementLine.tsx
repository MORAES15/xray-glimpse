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

    const calculateImageSpaceCoordinates = (point: {x: number, y: number}, canvas: HTMLCanvasElement) => {
      const imageElem = document.querySelector('.image-container img') as HTMLImageElement;
      if (!imageElem) return point;

      const rect = imageElem.getBoundingClientRect();
      return {
        x: (point.x / 100) * canvas.width,
        y: (point.y / 100) * canvas.height
      };
    };

    // Set canvas size with device pixel ratio
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const dpr = window.devicePixelRatio || 1;
      canvas.width = container.offsetWidth * dpr;
      canvas.height = container.offsetHeight * dpr;
      
      canvas.style.width = `${container.offsetWidth}px`;
      canvas.style.height = `${container.offsetHeight}px`;
    };

    updateCanvasSize();

    // Calculate points in image space
    const startPoint = calculateImageSpaceCoordinates(start, canvas);
    const endPoint = calculateImageSpaceCoordinates(end, canvas);

    // Reset transform and clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom and pan transformation
    ctx.translate(position.x, position.y);
    ctx.scale(zoom / 100, zoom / 100);

    // Set line styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0EA5E9';
    ctx.lineWidth = 2 / (zoom / 100); // Adjust line width for zoom

    // Draw line
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke();

    // Draw endpoints
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 4 / (zoom / 100), 0, Math.PI * 2);
    ctx.arc(endPoint.x, endPoint.y, 4 / (zoom / 100), 0, Math.PI * 2);
    ctx.fillStyle = '#0EA5E9';
    ctx.fill();

    // Calculate distance
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);

    // Reset transform for text rendering
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Calculate text position in screen space
    const midX = position.x + ((startPoint.x + endPoint.x) / 2) * (zoom / 100);
    const midY = position.y + ((startPoint.y + endPoint.y) / 2) * (zoom / 100);

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

    // Clean up function
    return () => {
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
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