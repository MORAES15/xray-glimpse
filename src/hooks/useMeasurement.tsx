import { useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

export const useMeasurement = () => {
  const [measureStart, setMeasureStart] = useState<Point | null>(null);
  const [measureEnd, setMeasureEnd] = useState<Point | null>(null);
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const calculateRelativePosition = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    return { x, y };
  };

  const handleMeasureClick = useCallback((e: React.MouseEvent<HTMLImageElement>, isGridView: boolean) => {
    if (!isMeasuring) return;

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
  }, [isMeasuring, measureStart]);

  const toggleMeasuring = useCallback((value: boolean) => {
    setIsMeasuring(value);
    if (!value) {
      setMeasureStart(null);
      setMeasureEnd(null);
      setMeasureDistance(null);
    }
  }, []);

  const resetMeasurement = useCallback(() => {
    setMeasureStart(null);
    setMeasureEnd(null);
    setMeasureDistance(null);
  }, []);

  return {
    measureStart,
    setMeasureStart,
    measureEnd,
    setMeasureEnd,
    measureDistance,
    setMeasureDistance,
    isMeasuring,
    handleMeasureClick,
    toggleMeasuring,
    resetMeasurement
  };
};