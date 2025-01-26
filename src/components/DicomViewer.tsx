import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';
import { useToast } from './ui/use-toast';

// Initialize cornerstone configuration
const initializeCornerstoneConfig = () => {
  try {
    // Initialize cornerstone core first
    cornerstone.events.addEventListener('cornerstoneimageloadprogress', (event: any) => {
      console.log('Image Load Progress:', event);
    });

    // Set external dependencies for cornerstone tools
    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    
    // Initialize WADO image loader
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = cornerstoneWADOImageLoader.wadors.dicomParser;
    
    // Initialize tools configuration
    cornerstoneTools.init({
      showSVGCursors: true,
    });
    
    // Set maximum cache size
    cornerstone.imageCache.setMaximumSizeBytes(83886080); // 80 MB
    
    // Add tools after initialization
    cornerstoneTools.addTool(cornerstoneTools.PanTool);
    cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
    cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
    cornerstoneTools.addTool(cornerstoneTools.MagnifyTool);

    console.log('Cornerstone initialized successfully');
  } catch (error) {
    console.error('Error in initializeCornerstoneConfig:', error);
    throw error;
  }
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
    const element = elementRef.current;
    if (!hasInitialized.current) {
      try {
        initializeCornerstoneConfig();
        hasInitialized.current = true;
        console.log('DicomViewer initialization complete');
      } catch (error) {
        console.error('Error initializing cornerstone config:', error);
        toast({
          title: "Error initializing DICOM viewer",
          description: "There was an error setting up the DICOM viewer",
          variant: "destructive"
        });
      }
    }

    return () => {
      if (element) {
        cornerstone.disable(element);
      }
    };
  }, []);

  useEffect(() => {
    const initializeViewer = async () => {
      if (!elementRef.current || !imageId) {
        console.log('Missing element or imageId');
        return;
      }

      try {
        const element = elementRef.current;
        
        // Enable the element
        if (!cornerstone.getEnabledElement(element)) {
          cornerstone.enable(element);
        }
        console.log('Element enabled for cornerstone');
        
        // Load and display the image
        console.log('Loading image:', imageId);
        const image = await cornerstone.loadImage(imageId);
        console.log('Image loaded successfully');
        
        await cornerstone.displayImage(element, image);
        console.log('Image displayed successfully');
        
        // Update viewport settings
        const viewport = cornerstone.getViewport(element);
        if (viewport) {
          viewport.scale = zoom / 100;
          viewport.translation = {
            x: position.x,
            y: position.y
          };
          cornerstone.setViewport(element, viewport);
          console.log('Viewport updated:', viewport);
        }
        
        // Activate tools
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 });
        
      } catch (error) {
        console.error('Error initializing DICOM viewer:', error);
        toast({
          title: "Error loading DICOM image",
          description: "There was an error loading the DICOM image",
          variant: "destructive"
        });
      }
    };

    initializeViewer();
  }, [imageId, position, zoom]);

  return (
    <div 
      ref={elementRef}
      className="dicom-image w-full h-full"
      style={{ 
        width: '100%', 
        height: '100%',
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