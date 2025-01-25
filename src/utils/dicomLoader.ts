import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser';

export const initializeDicomLoader = () => {
  // Enable cornerstone on the document body
  const element = document.createElement('div');
  element.style.width = '100%';
  element.style.height = '100%';
  cornerstone.enable(element);
};

export const loadDicomFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);
        
        // Create a blob URL for the DICOM file
        const blob = new Blob([byteArray], { type: 'application/dicom' });
        const imageId = URL.createObjectURL(blob);
        
        // Create cornerstone image object
        const image = {
          imageId,
          minPixelValue: 0,
          maxPixelValue: 255,
          slope: dataSet.floatString('x00281053', 1),
          intercept: dataSet.floatString('x00281052', 0),
          windowCenter: dataSet.floatString('x00281050', 127),
          windowWidth: dataSet.floatString('x00281051', 256),
          rows: dataSet.uint16('x00280010'),
          columns: dataSet.uint16('x00280011'),
          height: dataSet.uint16('x00280010'),
          width: dataSet.uint16('x00280011'),
          color: false,
          columnPixelSpacing: dataSet.floatString('x00280030', 1),
          rowPixelSpacing: dataSet.floatString('x00280030', 1),
          sizeInBytes: byteArray.length,
          getPixelData: () => {
            const pixelDataElement = dataSet.elements.x7fe00010;
            return new Uint8Array(arrayBuffer, pixelDataElement.dataOffset, pixelDataElement.length);
          }
        };

        // Register the image with cornerstone
        cornerstone.registerImageLoader(imageId, () => Promise.resolve(image));
        
        // Load the image to verify it works
        await cornerstone.loadImage(imageId);
        
        resolve(imageId);
      } catch (error) {
        console.error('Error parsing DICOM:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const isDicomImage = (imageId: string): boolean => {
  try {
    const image = cornerstone.imageCache.imageCache[imageId]?.image;
    return !!image;
  } catch (error) {
    return false;
  }
};

export const getDicomMetadata = (imageId: string) => {
  const image = cornerstone.imageCache.imageCache[imageId]?.image;
  if (!image) return null;
  
  return {
    windowCenter: image.windowCenter,
    windowWidth: image.windowWidth,
    rows: image.rows,
    columns: image.columns,
    slope: image.slope,
    intercept: image.intercept
  };
};