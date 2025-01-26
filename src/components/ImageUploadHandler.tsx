import React from 'react';
import { Upload } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface ImageUploadHandlerProps {
  onImagesUploaded: (files: File[]) => void;
}

const ImageUploadHandler = ({ onImagesUploaded }: ImageUploadHandlerProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      onImagesUploaded(fileArray);
      
      toast({
        title: "Files loaded",
        description: `Successfully loaded ${fileArray.length} file(s)`,
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