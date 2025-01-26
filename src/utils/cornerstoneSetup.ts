import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneTools from 'cornerstone-tools';
import dicomParser from 'dicom-parser';

export const initializeCornerstoneTools = () => {
  // Initialize cornerstone and its dependencies
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;

  // Configure webworker for image decoding
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    webWorkerPath: '/cornerstoneWADOImageLoaderWebWorker.js',
    taskConfiguration: {
      decodeTask: {
        loadCodecsOnStartup: true,
        initializeCodecsOnStartup: false,
        codecsPath: '/cornerstoneWADOImageLoaderCodecs.js',
      },
    },
  });

  // Register the DICOM image loader
  cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);
  cornerstone.registerImageLoader('dicomweb', cornerstoneWADOImageLoader.wadouri.loadImage);
  
  // Initialize tools
  cornerstoneTools.init();
};

export const setupCornerstoneElement = (element: HTMLElement) => {
  cornerstone.enable(element);
  
  // Add basic tools
  cornerstoneTools.addTool(cornerstoneTools.PanTool);
  cornerstoneTools.addTool(cornerstoneTools.ZoomTool);
  cornerstoneTools.addTool(cornerstoneTools.WwwcTool);
  
  // Activate tools
  cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 });
  cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 2 });
  cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 4 });
};

export const cleanupCornerstoneElement = (element: HTMLElement) => {
  cornerstone.disable(element);
};