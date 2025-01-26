import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import { useToast } from './ui/use-toast';

// Initialize cornerstone configuration
const initializeCornerstoneConfig = () => {
  cornerstone.imageCache.setMaximumSizeBytes(83886080); // 80 MB
  cornerstone.webGL.renderer.setOptions({
    preserveDrawingBuffer: true,
  });
};

interface DicomViewerProps {
  imageId: string;
  position: { x: number; y: number };
  zoom: number;
}

const DicomViewer = ({ imageId, position, zoom }: DicomViewerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      try {
        initializeCornerstoneConfig();
        hasInitialized.current = true;
      } catch (error) {
        console.error('Error initializing cornerstone config:', error);
      }
    }
  }, []);

  useEffect(() => {
    const initializeViewer = async () => {
      if (!elementRef.current || !imageId) return;

      try {
        const element = elementRef.current;
        
        // Enable the element for cornerstone
        await cornerstone.enable(element);
        
        // Load and display the image
        const image = await cornerstone.loadImage(imageId);
        await cornerstone.displayImage(element, image);
        
        // Update viewport settings
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          viewport.scale = zoom / 100;
          viewport.translation = {
            x: position.x,
            y: position.y
          };
          cornerstone.setViewport(element, viewport);
        }
        
        // Add event listeners for mouse interactions
        element.addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopPropagation();
        });
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
        try {
          cornerstone.disable(elementRef.current);
        } catch (error) {
          console.error('Error cleaning up DICOM viewer:', error);
        }
      }
    };
  }, [imageId, position, zoom]);

  return (
    <div 
      ref={elementRef}
      className="dicom-image w-full h-full"
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        backgroundColor: '#000'
      }}
    />
  );
};

export default DicomViewer;