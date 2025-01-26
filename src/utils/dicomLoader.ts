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
    cornerstone.registerImageLoader('wadouri', cornerstoneWADOImageLoader.wadouri.loadImage);
    cornerstone.registerImageLoader('dicomfile', loadImageFromBlob);
    console.log('DICOM loader initialized successfully');
  } catch (error) {
    console.error('Error initializing DICOM loader:', error);
    throw error;
  }
};

const loadImageFromBlob = (imageId: string) => {
  const blob = dataUriToBlob(imageId.replace('dicomfile:', ''));
  return cornerstoneWADOImageLoader.wadouri.loadImage(imageId, { blob });
};

const dataUriToBlob = (dataUri: string): Blob => {
  try {
    // If it's already a blob URL, fetch it and return the blob
    if (dataUri.startsWith('blob:')) {
      return fetch(dataUri).then(r => r.blob());
    }
    
    // Otherwise, convert data URI to blob
    const byteString = atob(dataUri.split(',')[1]);
    const mimeString = dataUri.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  } catch (error) {
    console.error('Error converting data URI to blob:', error);
    throw error;
  }
};

export const loadDicomFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const arrayBuffer = e.target.result as ArrayBuffer;
      const blob = new Blob([arrayBuffer], { type: file.type });
      const imageId = `dicomfile:${URL.createObjectURL(blob)}`;
      resolve(imageId);
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const isDicomImage = (imageId?: string): boolean => {
  if (!imageId) return false;
  return imageId.startsWith('dicomfile:');
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
