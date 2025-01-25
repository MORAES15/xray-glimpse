import React from 'react';
import { Upload } from 'lucide-react';

interface XRayEmptyStateProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const XRayEmptyState = ({ onFileUpload }: XRayEmptyStateProps) => {
  return (
    <div className="text-gray-500 flex flex-col items-center gap-4">
      <Upload size={48} className="text-medical" />
      <span>Upload X-Ray images to begin</span>
      <label className="cursor-pointer hover:text-medical">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFileUpload}
          className="hidden"
        />
        Click to upload
      </label>
    </div>
  );
};

export default XRayEmptyState;