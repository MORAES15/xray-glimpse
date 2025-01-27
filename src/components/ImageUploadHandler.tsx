import React from 'react';
import { Upload } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { loadDicomFile } from '../utils/dicomLoader';

interface ImageUploadHandlerProps {
  onImagesUploaded: (newImages: string[]) => void;
}

const diagnosticMessages = [
  "Clear Pneumonia Case:\nProminent bilateral infiltrates in lower lung zones, consistent with bacterial pneumonia. Dense consolidation in right lower lobe with air bronchograms. Recommend antibiotic therapy and follow-up imaging in 6-8 weeks.",
  "Normal Healthy Chest:\nClear lung fields bilaterally. Normal cardiac silhouette without cardiomegaly. No pleural effusions or pneumothorax. Unremarkable mediastinal contours. Routine follow-up recommended.",
  "Pulmonary Edema:\nBilateral interstitial edema with prominent Kerley B lines. Enlarged cardiac silhouette suggesting congestive heart failure. Cephalization of pulmonary vessels. Requires urgent cardiac evaluation.",
  "Lung Mass:\n3cm spiculated mass in right upper lobe highly suspicious for primary lung malignancy. No pleural effusions. Mediastinal lymphadenopathy noted. Immediate CT follow-up required.",
  "Tuberculosis:\nBilateral upper lobe cavitary lesions with surrounding infiltrates typical for active tuberculosis. Fibrotic changes and volume loss in right apex. Isolation precautions and infectious disease consultation recommended."
];

const ImageUploadHandler = ({ onImagesUploaded }: ImageUploadHandlerProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: string[] = [];
    let successCount = 0;
    let errorCount = 0;
    
    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        if (file.type === 'application/dicom' || file.name.toLowerCase().endsWith('.dcm')) {
          const imageId = await loadDicomFile(file);
          if (imageId) {
            newImages.push(imageId);
            successCount++;
          }
        } else if (file.type.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(file);
          newImages.push(imageUrl);
          successCount++;
        } else {
          errorCount++;
          console.error('Invalid file type:', file.type);
        }
      } catch (error) {
        errorCount++;
        console.error('Error loading file:', error);
      }
    });

    await Promise.all(uploadPromises);

    if (successCount > 0) {
      toast({
        title: "Images uploaded",
        description: `Successfully loaded ${successCount} image${successCount !== 1 ? 's' : ''}${
          errorCount > 0 ? `. Failed to load ${errorCount} file${errorCount !== 1 ? 's' : ''}.` : ''
        }`,
        variant: errorCount > 0 ? "destructive" : "default"
      });
      
      onImagesUploaded(newImages);
    } else if (errorCount > 0) {
      toast({
        title: "Upload failed",
        description: `Failed to load ${errorCount} file${errorCount !== 1 ? 's' : ''}. Please check file types and try again.`,
        variant: "destructive"
      });
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
