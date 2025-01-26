import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

export const initializeCornerstoneTools = () => {
  // First initialize cornerstone core
  cornerstone.events.addEventListener('cornerstoneimageloaded', (event: any) => {
    console.log('Image loaded event:', event);
  });

  // Then initialize cornerstone tools with the core reference
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.init({
    showSVGCursors: true,
  });

  // Add any default tools you want to use
  const PanTool = cornerstoneTools.PanTool;
  const ZoomTool = cornerstoneTools.ZoomTool;
  
  cornerstoneTools.addTool(PanTool);
  cornerstoneTools.addTool(ZoomTool);

  console.log('Cornerstone tools initialized successfully');
};

export const setupCornerstoneElement = (element: HTMLElement) => {
  try {
    // Enable the element with cornerstone core first
    cornerstone.enable(element);
    
    // Then set up the tools for this element
    cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
    cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
    
    console.log('Cornerstone element setup complete');
  } catch (error) {
    console.error('Error setting up cornerstone element:', error);
  }
};

export const cleanupCornerstoneElement = (element: HTMLElement) => {
  try {
    // Disable tools first
    cornerstoneTools.setToolDisabled('Pan');
    cornerstoneTools.setToolDisabled('Zoom');
    
    // Then disable the element
    cornerstone.disable(element);
  } catch (error) {
    console.error('Error cleaning up cornerstone element:', error);
  }
};