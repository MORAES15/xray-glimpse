import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

export const initializeDicomLoader = () => {
  // Configure cornerstone to use the WADO image loader
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  
  // Register the DICOM image loader
  cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);
  
  console.log('DICOM loader initialized');
};

export const loadDicomFile = async (file: File): Promise<string> => {
  // Create a URL for the file
  const imageId = `wadouri:${URL.createObjectURL(file)}`;
  console.log('Created image ID:', imageId);
  return imageId;
};

export const isDicomImage = (imageId?: string): boolean => {
  return !!imageId && imageId.startsWith('wadouri:');
};