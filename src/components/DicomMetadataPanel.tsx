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

  const formatValue = (value: number | undefined) => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  return (
    <div className="bg-black/60 p-4 rounded-lg">
      <h3 className="text-white font-semibold mb-2">DICOM Metadata</h3>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          <div className="text-sm text-gray-300">
            <span className="font-medium">Window Center: </span>
            {formatValue(metadata.windowCenter)}
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-medium">Window Width: </span>
            {formatValue(metadata.windowWidth)}
          </div>
          <div className="text-sm text-gray-300">
            <span className="font-medium">Scale: </span>
            {formatValue(metadata.scale)}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default DicomMetadataPanel;