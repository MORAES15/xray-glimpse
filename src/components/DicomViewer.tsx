import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';
import { useToast } from './ui/use-toast';

// Initialize cornerstone configuration
const initializeCornerstoneConfig = () => {
  // Initialize external modules
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  
  // Initialize image loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = cornerstoneWADOImageLoader.wadors.dicomParser;
  
  // Set maximum cache size
  cornerstone.imageCache.setMaximumSizeBytes(83886080); // 80 MB
  
  // Initialize tools
  cornerstoneTools.init({
    showSVGCursors: true,
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
        toast({
          title: "Error initializing DICOM viewer",
          description: "There was an error setting up the DICOM viewer",
          variant: "destructive"
        });
      }
    }
  }, []);

  useEffect(() => {
    const initializeViewer = async () => {
      if (!elementRef.current || !imageId) return;

      try {
        const element = elementRef.current;
        
        // Enable the element for cornerstone
        cornerstone.enable(element);
        
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
        
        // Initialize tools
        cornerstoneTools.addTool(cornerstoneTools.PanTool);
        cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
        
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