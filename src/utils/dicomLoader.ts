import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser';

export const initializeDicomLoader = () => {
  cornerstone.registerImageLoader('dicomFile', loadImageFromArrayBuffer);
};

const loadImageFromArrayBuffer = async (imageId: string) => {
  try {
    const response = await fetch(imageId);
    const arrayBuffer = await response.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    const dataSet = dicomParser.parseDicom(byteArray);

    const pixelDataElement = dataSet.elements.x7fe00010;
    const pixelData = new Uint16Array(arrayBuffer, pixelDataElement.dataOffset, pixelDataElement.length / 2);

    const image = {
      imageId,
      minPixelValue: 0,
      maxPixelValue: 4095, // Typical for 12-bit DICOM
      slope: dataSet.floatString('x00281053', 1),
      intercept: dataSet.floatString('x00281052', 0),
      windowCenter: dataSet.floatString('x00281050', 2048),
      windowWidth: dataSet.floatString('x00281051', 4096),
      rows: dataSet.uint16('x00280010'),
      columns: dataSet.uint16('x00280011'),
      height: dataSet.uint16('x00280010'),
      width: dataSet.uint16('x00280011'),
      color: false,
      columnPixelSpacing: dataSet.floatString('x00280030', 1),
      rowPixelSpacing: dataSet.floatString('x00280030', 1),
      sizeInBytes: byteArray.length,
      getPixelData: () => pixelData
    };

    return image;
  } catch (error) {
    console.error('Error loading DICOM image:', error);
    throw error;
  }
};

export const loadDicomFile = async (file: File): Promise<string> => {
  const imageId = URL.createObjectURL(file);
  return `dicomFile:${imageId}`;
};

export const isDicomImage = (imageId?: string): boolean => {
  if (!imageId) return false;
  return imageId.startsWith('dicomFile:');
};

export const getDicomMetadata = (imageId: string) => {
  try {
    const element = document.querySelector('.dicom-image') as HTMLElement;
    if (!element) return null;
    
    const viewport = cornerstone.getViewport(element);
    return {
      windowCenter: viewport?.voi?.windowCenter,
      windowWidth: viewport?.voi?.windowWidth,
      scale: viewport?.scale,
      translation: viewport?.translation
    };
  } catch (error) {
    console.error('Error getting DICOM metadata:', error);
    return null;
  }
};