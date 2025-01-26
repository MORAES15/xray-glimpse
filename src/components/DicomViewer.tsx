import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';
import { useToast } from './ui/use-toast';

interface DicomViewerProps {
  imageId: string;
  position: { x: number; y: number };
  zoom: number;
}

const DicomViewer = ({ imageId, position, zoom }: DicomViewerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isInitialized = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isInitialized.current) return;

    // Basic cornerstone setup
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    
    // Enable the element
    cornerstone.enable(element);
    
    // Initialize tools
    cornerstoneTools.init();
    
    // Add basic tools
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
    
    isInitialized.current = true;
    console.log('DicomViewer initialized');

    return () => {
      if (element) {
        cornerstone.disable(element);
        isInitialized.current = false;
      }
    };
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !imageId || !isInitialized.current) return;

    const loadAndDisplayImage = async () => {
      try {
        console.log('Loading image:', imageId);
        const image = await cornerstone.loadImage(imageId);
        await cornerstone.displayImage(element, image);
        
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          viewport.scale = zoom / 100;
          viewport.translation = position;
          cornerstone.setViewport(element, viewport);
        }

        // Activate tools
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 });
      } catch (error) {
        console.error('Error loading DICOM image:', error);
        toast({
          title: "Error loading DICOM image",
          description: "Failed to load or display the image",
          variant: "destructive"
        });
      }
    };

    loadAndDisplayImage();
  }, [imageId, position, zoom]);

  return (
    <div 
      ref={elementRef}
      className="dicom-image w-full h-full"
      style={{ 
        minHeight: '400px',
        position: 'relative',
        backgroundColor: '#000',
        touchAction: 'none',
        userSelect: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
};

export default DicomViewer;