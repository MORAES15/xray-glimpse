import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import { initializeCornerstoneTools, setupCornerstoneElement, cleanupCornerstoneElement } from '../utils/cornerstoneSetup';
import { useDicomImage } from '../hooks/useDicomImage';

interface DicomViewerProps {
  imageId: string;
  position: { x: number; y: number };
  zoom: number;
}

const DicomViewer = ({ imageId, position, zoom }: DicomViewerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize tools once when component mounts
    initializeCornerstoneTools();
  }, []);

  useEffect(() => {
    if (!elementRef.current) return;

    console.log('Setting up cornerstone element...');
    setupCornerstoneElement(elementRef.current);

    return () => {
      if (elementRef.current) {
        cleanupCornerstoneElement(elementRef.current);
      }
    };
  }, []);

  const { error, isLoading } = useDicomImage({
    element: elementRef.current,
    imageId,
    position,
    zoom,
  });

  if (error) {
    return <div className="text-red-500">Error loading DICOM image: {error}</div>;
  }

  if (isLoading) {
    return <div className="text-white">Loading DICOM image...</div>;
  }

  return (
    <div
      ref={elementRef}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
};

export default DicomViewer;