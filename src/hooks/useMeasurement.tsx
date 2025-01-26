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

  const handleMeasureClick = useCallback((e: React.MouseEvent<HTMLImageElement>, isGridView: boolean) => {
    if (!isMeasuring) return;
    // The actual click handling is now in XRayViewer component
  }, [isMeasuring]);

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
