import React, { useEffect, useRef } from 'react';
import { useToast } from './ui/use-toast';
import { initializeCornerstoneTools, setupCornerstoneElement, cleanupCornerstoneElement } from '../utils/cornerstoneSetup';
import { useDicomImage } from '../hooks/useDicomImage';

interface DicomViewerProps {
  imageId: string;
  position: { x: number; y: number };
  zoom: number;
}

const DicomViewer = ({ imageId, position, zoom }: DicomViewerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isInitialized = useRef(false);

  // Initialize cornerstone tools
  useEffect(() => {
    if (isInitialized.current) return;
    
    try {
      console.log('Initializing cornerstone tools...');
      initializeCornerstoneTools();
      isInitialized.current = true;
      console.log('Cornerstone tools initialized successfully');
    } catch (error) {
      console.error('Error initializing cornerstone tools:', error);
      toast({
        title: "Error initializing DICOM viewer",
        description: "Failed to initialize the DICOM viewer",
        variant: "destructive"
      });
    }
  }, []);

  // Setup cornerstone element
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    try {
      console.log('Setting up cornerstone element...');
      setupCornerstoneElement(element);
      console.log('Cornerstone element setup complete');
    } catch (error) {
      console.error('Error setting up cornerstone element:', error);
      toast({
        title: "Error setting up viewer",
        description: "Failed to setup the DICOM viewer",
        variant: "destructive"
      });
    }

    return () => {
      cleanupCornerstoneElement(element);
    };
  }, []);

  // Load and display DICOM image
  const { error, isLoading } = useDicomImage({
    element: elementRef.current,
    imageId,
    position,
    zoom
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading DICOM image",
        description: error,
        variant: "destructive"
      });
    }
  }, [error]);

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
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          Loading DICOM image...
        </div>
      )}
    </div>
  );
};

export default DicomViewer;