import React from 'react';
import { Upload } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ImageUploadHandlerProps {
  onImagesUploaded: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadHandler = ({ onImagesUploaded }: ImageUploadHandlerProps) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onImagesUploaded(event);
      
      toast({
        title: "Files loaded",
        description: `Successfully loaded ${event.target.files.length} file(s)`,
      });
    }
  };

  return (
    <div className="text-gray-500 flex flex-col items-center gap-4">
      <Upload size={48} className="text-medical" />
      <span>Upload DICOM images to begin</span>
      <label className="cursor-pointer hover:text-medical">
        <input
          type="file"
          accept=".dcm"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
        Click to upload
      </label>
    </div>
  );
};

export default ImageUploadHandler;