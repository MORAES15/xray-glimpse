import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

export const initializeDicomLoader = () => {
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);
  console.log('DICOM loader initialized');
};

export const loadDicomFile = async (file: File): Promise<string> => {
  const imageId = `wadouri:${URL.createObjectURL(file)}`;
  console.log('Created image ID:', imageId);
  return imageId;
};

export const isDicomImage = (imageId?: string): boolean => {
  return !!imageId && imageId.startsWith('wadouri:');
};

export const getDicomMetadata = (imageId: string) => {
  try {
    const element = document.createElement('div');
    cornerstone.enable(element);
    const image = cornerstone.imageCache.getImageLoadObject(imageId);
    
    if (!image || !image.image) {
      console.log('No image data available for metadata');
      return null;
    }

    return {
      windowCenter: image.image.windowCenter,
      windowWidth: image.image.windowWidth,
      scale: image.image.scale || 1.0
    };
  } catch (error) {
    console.error('Error getting DICOM metadata:', error);
    return null;
  }
};