import React, { useState } from 'react';
import { useToast } from './ui/use-toast';
import { useMeasurement } from '../hooks/useMeasurement';
import ViewerControls from './viewer/ViewerControls';
import ViewerDisplay from './viewer/ViewerDisplay';

const XRayViewer = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const { toast } = useToast();

  const {
    measureStart,
    measureEnd,
    measureDistance,
    isMeasuring,
    handleMeasureClick,
    toggleMeasuring,
    resetMeasurement
  } = useMeasurement();

  const handleImagesUploaded = (newImages: string[]) => {
    if (Array.isArray(newImages) && newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setCurrentImageIndex(images.length);
      toast({
        title: "Images uploaded successfully",
        description: `Added ${newImages.length} new image${newImages.length > 1 ? 's' : ''}`
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMeasuring) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMeasuring || !isDragging) return;
    const deltaX = e.movementX;
    const deltaY = e.movementY;
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>, clickedImageIndex?: number) => {
    if (isGridView && typeof clickedImageIndex === 'number') {
      setCurrentImageIndex(clickedImageIndex);
    }
    if (isMeasuring) {
      handleMeasureClick(e, isGridView);
    }
  };

  const handleExportImage = () => {
    const canvas = document.createElement('canvas');
    const image = document.querySelector('.image-display') as HTMLImageElement;
    
    if (!image) {
      toast({
        title: "Export failed",
        description: "No image found to export",
        variant: "destructive"
      });
      return;
    }

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      toast({
        title: "Export failed",
        description: "Could not create export context",
        variant: "destructive"
      });
      return;
    }

    ctx.filter = `contrast(${contrast}%) brightness(${exposure}%)`;
    ctx.drawImage(image, 0, 0);

    const link = document.createElement('a');
    link.download = `xray-export-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    toast({
      title: "Image exported successfully",
      description: "The image has been downloaded to your device"
    });
  };

  return (
    <div className="flex h-screen p-4 gap-4 max-w-full overflow-hidden">
      <div className="flex flex-1 gap-4 flex-col md:flex-row">
        <ViewerControls
          zoom={zoom}
          setZoom={setZoom}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          isMeasuring={isMeasuring}
          setIsMeasuring={toggleMeasuring}
          setPosition={setPosition}
          setIsDragging={setIsDragging}
          isGridView={isGridView}
          setIsGridView={setIsGridView}
          setContrast={setContrast}
          setExposure={setExposure}
          currentImageId={images[currentImageIndex]}
          onExportImage={handleExportImage}
        />
        
        <ViewerDisplay
          images={images}
          currentImageIndex={currentImageIndex}
          setCurrentImageIndex={setCurrentImageIndex}
          contrast={contrast}
          exposure={exposure}
          position={position}
          zoom={zoom}
          showHeatmap={showHeatmap}
          isGridView={isGridView}
          measureStart={measureStart}
          measureEnd={measureEnd}
          measureDistance={measureDistance}
          isMeasuring={isMeasuring}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleImageClick}
          onImagesUploaded={handleImagesUploaded}
        />
      </div>
    </div>
  );
};

export default XRayViewer;