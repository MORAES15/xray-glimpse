import { useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

export const useMeasurementCalculation = () => {
  const [measureStart, setMeasureStart] = useState<Point | null>(null);
  const [measureEnd, setMeasureEnd] = useState<Point | null>(null);
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);

  const calculateRelativePosition = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    return { x, y };
  }, []);

  const handleMeasureClick = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
    const pos = calculateRelativePosition(e);
    
    if (!measureStart) {
      setMeasureStart(pos);
      setMeasureEnd(null);
      setMeasureDistance(null);
    } else {
      setMeasureEnd(pos);
      const dx = pos.x - measureStart.x;
      const dy = pos.y - measureStart.y;
      const distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);
      setMeasureDistance(distance);
    }
  }, [measureStart, calculateRelativePosition]);

  const resetMeasurement = useCallback(() => {
    setMeasureStart(null);
    setMeasureEnd(null);
    setMeasureDistance(null);
  }, []);

  return {
    measureStart,
    measureEnd,
    measureDistance,
    handleMeasureClick,
    resetMeasurement
  };
};