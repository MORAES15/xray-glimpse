import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useMeasurement = () => {
  const { toast } = useToast();
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null);
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);

  const calculateDistance = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    if (!start || !end) return "0";
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  };

  const handleMeasureClick = (x: number, y: number) => {
    if (!isMeasuring) return;

    if (!measureStart) {
      setMeasureStart({ x, y });
      toast({ title: "Start point set" });
    } else {
      setMeasureEnd({ x, y });
      const distance = calculateDistance(measureStart, { x, y });
      setMeasureDistance(distance);
      toast({ title: `Distance: ${distance}px` });
    }
  };

  const resetMeasurement = () => {
    setIsMeasuring(false);
    setMeasureStart(null);
    setMeasureEnd(null);
    setMeasureDistance(null);
  };

  return {
    isMeasuring,
    setIsMeasuring,
    measureStart,
    measureEnd,
    measureDistance,
    handleMeasureClick,
    resetMeasurement
  };
};