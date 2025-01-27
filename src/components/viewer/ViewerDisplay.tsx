import React from 'react';
import ImageDisplay from '../ImageDisplay';
import ImageUploadHandler from '../ImageUploadHandler';
import XRayQueue from '../XRayQueue';
import XRayGrid from '../XRayGrid';

interface ViewerDisplayProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  contrast: number;
  exposure: number;
  position: { x: number; y: number };
  zoom: number;
  showHeatmap: boolean;
  isGridView: boolean;
  measureStart: { x: number; y: number } | null;
  measureEnd: { x: number; y: number } | null;
  measureDistance: string | null;
  isMeasuring: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLImageElement>) => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
  onClick: (e: React.MouseEvent<HTMLImageElement>, index?: number) => void;
  onImagesUploaded: (newImages: string[]) => void;
}

const ViewerDisplay = ({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  contrast,
  exposure,
  position,
  zoom,
  showHeatmap,
  isGridView,
  measureStart,
  measureEnd,
  measureDistance,
  isMeasuring,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick,
  onImagesUploaded
}: ViewerDisplayProps) => {
  return (
    <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden relative">
      {images.length > 0 ? (
        <>
          {isGridView ? (
            <XRayGrid
              images={images}
              startIndex={Math.floor(currentImageIndex / 4) * 4}
              contrast={contrast}
              exposure={exposure}
              onImageClick={onClick}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
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
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
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
        <ImageUploadHandler onImagesUploaded={onImagesUploaded} />
      )}
    </div>
  );
};

export default ViewerDisplay;