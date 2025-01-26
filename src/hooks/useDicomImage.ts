import { useState, useEffect } from 'react';
import * as cornerstone from 'cornerstone-core';

interface UseDicomImageProps {
  element: HTMLElement | null;
  imageId: string;
  position: { x: number; y: number };
  zoom: number;
}

export const useDicomImage = ({ element, imageId, position, zoom }: UseDicomImageProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!element || !imageId) return;

    const loadAndDisplayImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading DICOM image:', imageId);
        const image = await cornerstone.loadImage(imageId);
        console.log('DICOM image loaded:', image);
        
        await cornerstone.displayImage(element, image);
        console.log('DICOM image displayed');
        
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          viewport.scale = zoom / 100;
          viewport.translation = position;
          cornerstone.setViewport(element, viewport);
          console.log('Viewport updated:', viewport);
        }
      } catch (err) {
        console.error('Error in useDicomImage:', err);
        setError(err instanceof Error ? err.message : 'Failed to load or display image');
      } finally {
        setIsLoading(false);
      }
    };

    loadAndDisplayImage();
  }, [element, imageId, position, zoom]);

  return { error, isLoading };
};