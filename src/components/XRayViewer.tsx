import React, { useState, useEffect } from 'react';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayGrid from './XRayGrid';
import XRayToolbar from './XRayToolbar';
import XRayControlPanel from './XRayControlPanel';
import DicomMetadataPanel from './DicomMetadataPanel';
import ImageUploadHandler from './ImageUploadHandler';
import ImageDisplay from './ImageDisplay';
import { useMeasurement } from '../hooks/useMeasurement';
import { initializeDicomLoader, isDicomImage } from '../utils/dicomLoader';

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
    setMeasureStart,
    measureEnd,
    setMeasureEnd,
    measureDistance,
    setMeasureDistance,
    isMeasuring,
    handleMeasureClick,
    toggleMeasuring,
    resetMeasurement
  } = useMeasurement();

  useEffect(() => {
    initializeDicomLoader();
  }, []);

  useEffect(() => {
    resetMeasurement();
  }, [isGridView, resetMeasurement]);

  const handleImagesUploaded = (newImages: string[]) => {
    if (Array.isArray(newImages) && newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setCurrentImageIndex(images.length);
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

  return (
    <div className="flex h-screen p-4 gap-4 max-w-full overflow-hidden">
      <div className="flex flex-1 gap-4 flex-col md:flex-row">
        <div className="flex gap-4 flex-row md:flex-col">
          <XRayToolbar
            isMeasuring={isMeasuring}
            setIsMeasuring={toggleMeasuring}
            setZoom={setZoom}
            setPosition={setPosition}
            setIsDragging={setIsDragging}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            setContrast={setContrast}
            setExposure={setExposure}
            currentImageId={images[currentImageIndex]}
          />
          {isDicomImage(images[currentImageIndex]) && (
            <DicomMetadataPanel imageId={images[currentImageIndex]} />
          )}
        </div>

        <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden relative">
          {images.length > 0 ? (
            <>
              {isGridView ? (
                <XRayGrid
                  images={images}
                  startIndex={Math.floor(currentImageIndex / 4) * 4}
                  contrast={contrast}
                  exposure={exposure}
                  onImageClick={handleImageClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  showHeatmap={showHeatmap}
                  zoom={zoom}
                  position={position}
                  measureStart={measureStart}
                  measureEnd={measureEnd}
                  activeImageIndex={currentImageIndex}
                  isMeasuring={isMeasuring}
                  measureDistance={measureDistance}
                />
              ) : (
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                  <ImageDisplay
                    imageUrl={images[currentImageIndex]}
                    contrast={contrast}
                    exposure={exposure}
                    position={position}
                    zoom={zoom}
                    showHeatmap={showHeatmap}
                    measureStart={measureStart}
                    measureEnd={measureEnd}
                    measureDistance={measureDistance}
                    isMeasuring={isMeasuring}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleImageClick}
                  />
                </div>
              )}
              <div className="absolute right-0 top-0 bottom-0 w-24">
                <XRayQueue
                  images={images}
                  currentIndex={currentImageIndex}
                  onSelect={setCurrentImageIndex}
                />
              </div>
            </>
          ) : (
            <ImageUploadHandler onImagesUploaded={handleImagesUploaded} />
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <XRayControlPanel
          zoom={zoom}
          setZoom={setZoom}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          onFileUpload={() => {}}
        />
      </div>
    </div>
  );
};

export default XRayViewer;