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

  const calculateDistance = useCallback((start: Point, end: Point) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  }, []);

  const handleMeasureClick = useCallback((e: React.MouseEvent<HTMLImageElement>, isGridView: boolean) => {
    if (!isMeasuring) return;

    const target = e.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (!measureStart) {
      setMeasureStart({ x, y });
      setMeasureEnd(null);
      setMeasureDistance(null);
    } else {
      setMeasureEnd({ x, y });
      const distance = calculateDistance(measureStart, { x, y });
      setMeasureDistance(distance);
    }
  }, [isMeasuring, measureStart, calculateDistance]);

  const resetMeasurement = useCallback(() => {
    setMeasureStart(null);
    setMeasureEnd(null);
    setMeasureDistance(null);
    setIsMeasuring(false);
  }, []);

  const toggleMeasuring = useCallback((value: boolean) => {
    setIsMeasuring(value);
    if (!value) {
      resetMeasurement();
    }
  }, [resetMeasurement]);

  return {
    measureStart,
    measureEnd,
    measureDistance,
    isMeasuring,
    handleMeasureClick,
    toggleMeasuring,
    resetMeasurement
  };
};