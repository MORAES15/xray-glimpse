import React from 'react';
import { getDicomMetadata } from '../utils/dicomLoader';
import { ScrollArea } from './ui/scroll-area';

interface DicomMetadataPanelProps {
  imageId?: string;
}

const DicomMetadataPanel = ({ imageId }: DicomMetadataPanelProps) => {
  if (!imageId) return null;
  
  const metadata = getDicomMetadata(imageId);
  if (!metadata) return null;

  return (
    <div className="bg-black/60 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-2">DICOM Metadata</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          <div className="text-sm text-gray-300">
            <span className="font-medium">Window Center: </span>
            {metadata.windowCenter.toFixed(2)}
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-medium">Window Width: </span>
            {metadata.windowWidth.toFixed(2)}
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-medium">Scale: </span>
            {metadata.scale.toFixed(2)}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DicomMetadataPanel;