import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser';

export const initializeDicomLoader = () => {
  cornerstone.registerImageLoader('dicomFile', loadImageFromArrayBuffer);
};

const loadImageFromArrayBuffer = async (imageId: string) => {
  try {
    // Remove the 'dicomFile:' prefix to get the actual blob URL
    const blobUrl = imageId.replace('dicomFile:', '');
    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    const dataSet = dicomParser.parseDicom(byteArray);

    const pixelDataElement = dataSet.elements.x7fe00010;
    if (!pixelDataElement) {
      throw new Error('No pixel data found in DICOM file');
    }

    const pixelData = new Uint16Array(arrayBuffer, pixelDataElement.dataOffset, pixelDataElement.length / 2);

    return {
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
    if (!viewport) return null;

    return {
      windowCenter: viewport.voi?.windowCenter ?? 0,
      windowWidth: viewport.voi?.windowWidth ?? 0,
      scale: viewport.scale ?? 1,
      translation: viewport.translation ?? { x: 0, y: 0 }
    };
  } catch (error) {
    console.error('Error getting DICOM metadata:', error);
    return null;
  }
};