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

          // Add a random diagnostic message to the chat
          const randomMessage = diagnosticMessages[Math.floor(Math.random() * diagnosticMessages.length)];
          console.log('Dispatching message:', randomMessage);
          
          const chatEvent = new CustomEvent('newChatMessage', {
            detail: {
              message: {
                id: Date.now().toString(),
                text: randomMessage,
                sender: 'JamesBot',
                timestamp: new Date()
              }
            }
          });
          window.dispatchEvent(chatEvent);

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