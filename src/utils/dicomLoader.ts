import * as cornerstone from 'cornerstone-core';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import * as dicomParser from 'dicom-parser';

export const initializeDicomLoader = () => {
  try {
    // Configure webworker for image decoding
    const config = {
      webWorkerPath: `${window.location.origin}/cornerstoneWADOImageLoaderWebWorker.js`,
      taskConfiguration: {
        decodeTask: {
          loadCodecsOnStartup: true,
          initializeCodecsOnStartup: false,
          codecsPath: `${window.location.origin}/cornerstoneWADOImageLoaderCodecs.js`,
          usePDFJS: false,
        },
      },
    };
    
    cornerstoneWADOImageLoader.webWorkerManager.initialize(config);
    cornerstone.registerImageLoader('dicomFile', loadImageFromArrayBuffer);
    console.log('DICOM loader initialized successfully');
  } catch (error) {
    console.error('Error initializing DICOM loader:', error);
    throw error;
  }
};

const loadImageFromArrayBuffer = async (imageId: string) => {
  try {
    console.log('Loading image from array buffer:', imageId);
    const cleanImageId = imageId.replace('dicomFile:', '');
    const response = await fetch(cleanImageId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const byteArray = new Uint8Array(arrayBuffer);
    
    try {
      const dataSet = dicomParser.parseDicom(byteArray);
      console.log('DICOM data parsed successfully');

      const pixelDataElement = dataSet.elements.x7fe00010;
      if (!pixelDataElement) {
        throw new Error('No pixel data found in DICOM file');
      }

      const pixelData = new Uint16Array(arrayBuffer, pixelDataElement.dataOffset, pixelDataElement.length / 2);
      const rows = dataSet.uint16('x00280010');
      const columns = dataSet.uint16('x00280011');

      return {
        imageId: cleanImageId,
        minPixelValue: 0,
        maxPixelValue: 4095,
        slope: dataSet.floatString('x00281053', 1),
        intercept: dataSet.floatString('x00281052', 0),
        windowCenter: dataSet.floatString('x00281050', 2048),
        windowWidth: dataSet.floatString('x00281051', 4096),
        getPixelData: () => pixelData,
        rows,
        columns,
        height: rows,
        width: columns,
        color: false,
        columnPixelSpacing: dataSet.floatString('x00280030', 1),
        rowPixelSpacing: dataSet.floatString('x00280030', 1),
        sizeInBytes: byteArray.length
      };
    } catch (parseError) {
      console.error('Error parsing DICOM data:', parseError);
      throw parseError;
    }
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
    if (!element) {
      console.log('No DICOM image element found');
      return null;
    }
    
    const viewport = cornerstone.getViewport(element);
    if (!viewport) {
      console.log('No viewport found');
      return null;
    }

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