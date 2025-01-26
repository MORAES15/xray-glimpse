import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

export const initializeCornerstoneTools = () => {
  // Initialize cornerstone tools
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.init();
  console.log('Cornerstone tools initialized');
};

export const setupCornerstoneElement = (element: HTMLElement) => {
  // Enable the element for cornerstone
  cornerstone.enable(element);
  console.log('Cornerstone element enabled');
};

export const cleanupCornerstoneElement = (element: HTMLElement) => {
  try {
    cornerstone.disable(element);
  } catch (error) {
    console.error('Error cleaning up cornerstone element:', error);
  }
};