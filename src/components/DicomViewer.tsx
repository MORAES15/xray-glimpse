import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import { useToast } from './ui/use-toast';

interface DicomViewerProps {
  imageId: string;
  position: { x: number; y: number };
  zoom: number;
}

const DicomViewer = ({ imageId, position, zoom }: DicomViewerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initializeViewer = async () => {
      if (!elementRef.current || !imageId) return;

      try {
        await cornerstone.enable(elementRef.current);
        const image = await cornerstone.loadImage(imageId);
        await cornerstone.displayImage(elementRef.current, image);
        
        // Set initial viewport settings
        const viewport = cornerstone.getViewport(elementRef.current);
        if (viewport) {
          viewport.scale = zoom / 100;
          viewport.translation.x = position.x;
          viewport.translation.y = position.y;
          cornerstone.setViewport(elementRef.current, viewport);
        }
      } catch (error) {
        console.error('Error initializing DICOM viewer:', error);
        toast({
          title: "Error loading DICOM image",
          description: "There was an error initializing the DICOM viewer",
          variant: "destructive"
        });
      }
    };

    initializeViewer();

    return () => {
      if (elementRef.current) {
        cornerstone.disable(elementRef.current);
      }
    };
  }, [imageId, position, zoom]);

  return (
    <div 
      ref={elementRef}
      className="dicom-image w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default DicomViewer;