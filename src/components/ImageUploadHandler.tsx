import React from 'react';
import { Upload } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { loadDicomFile } from '../utils/dicomLoader';

interface ImageUploadHandlerProps {
  onImagesUploaded: (newImages: string[]) => void;
}

const ImageUploadHandler = ({ onImagesUploaded }: ImageUploadHandlerProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      
      for (const file of Array.from(files)) {
        try {
          if (file.type === 'application/dicom' || file.name.toLowerCase().endsWith('.dcm')) {
            const imageId = await loadDicomFile(file);
            if (imageId) {
              newImages.push(imageId);
              toast({
                title: "DICOM file loaded",
                description: `Successfully loaded ${file.name}`,
              });
            }
          } else {
            const imageUrl = URL.createObjectURL(file);
            newImages.push(imageUrl);
          }
        } catch (error) {
          console.error('Error loading file:', error);
          toast({
            title: "Error loading file",
            description: `Failed to load ${file.name}. Make sure it's a valid image or DICOM file.`,
            variant: "destructive"
          });
        }
      }
      
      onImagesUploaded(newImages);
    }
  };

  return (
    <div className="text-gray-500 flex flex-col items-center gap-4">
      <Upload size={48} className="text-medical" />
      <span>Upload X-Ray images to begin</span>
      <label className="cursor-pointer hover:text-medical">
        <input
          type="file"
          accept="image/*,.dcm"
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