import * as cornerstone from 'cornerstone-core';
import * as dicomParser from 'dicom-parser';

export const initializeDicomLoader = () => {
  // Initialize cornerstone
  cornerstone.enable(document.body);
};

export const loadDicomFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(byteArray);
        
        // Create image object
        const image = {
          imageId: URL.createObjectURL(file),
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
          getPixelData: () => new Uint8Array(arrayBuffer)
        };

        // Register the image with cornerstone
        cornerstone.registerImageLoader(image.imageId, () => Promise.resolve(image));
        
        resolve(image.imageId);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const isDicomImage = (imageId: string): boolean => {
  return cornerstone.imageCache.imageCache[imageId]?.image !== undefined;
};

export const getDicomMetadata = (imageId: string) => {
  const image = cornerstone.imageCache.imageCache[imageId];
  if (!image) return null;
  
  return {
    windowCenter: image.windowCenter,
    windowWidth: image.windowWidth,
    rows: image.rows,
    columns: image.columns
  };
};