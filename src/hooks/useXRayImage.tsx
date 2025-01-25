import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useXRayImage = () => {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
      if (images.length === 0) {
        setCurrentImageIndex(0);
      }
      toast({
        title: `${files.length} image(s) uploaded`,
        description: "X-Ray images have been loaded successfully.",
      });
    }
  };

  return {
    images,
    currentImageIndex,
    setCurrentImageIndex,
    contrast,
    setContrast,
    exposure,
    setExposure,
    zoom,
    setZoom,
    position,
    setPosition,
    handleFileUpload
  };
};