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

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Loading image:', imageId);
        const image = await cornerstone.loadImage(imageId);
        
        console.log('Displaying image');
        await cornerstone.displayImage(element, image);
        
        // Update viewport
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          viewport.scale = zoom / 100;
          viewport.translation = position;
          cornerstone.setViewport(element, viewport);
        }
        
        console.log('Image displayed successfully');
      } catch (err) {
        console.error('Error loading/displaying image:', err);
        setError('Failed to load or display image');
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [element, imageId, position.x, position.y, zoom]);

  return { error, isLoading };
};