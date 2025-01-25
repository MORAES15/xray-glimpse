import React, { useState, useEffect } from 'react';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayGrid from './XRayGrid';
import XRayToolbar from './XRayToolbar';
import XRayControlPanel from './XRayControlPanel';
import DicomMetadataPanel from './DicomMetadataPanel';
import ImageUploadHandler from './ImageUploadHandler';
import DicomViewer from './DicomViewer';
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
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null);
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    initializeDicomLoader();
  }, []);

  const handleImagesUploaded = (newImages: string[]) => {
    setImages(prev => [...prev, ...newImages]);
    if (images.length === 0) {
      setCurrentImageIndex(0);
    }
  };

  const calculateDistance = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    if (!start || !end) return "0";
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>, clickedImageIndex?: number) => {
    if (!isMeasuring) return;

    const target = e.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (isGridView && typeof clickedImageIndex === 'number') {
      setCurrentImageIndex(clickedImageIndex);
    }

    if (!measureStart) {
      setMeasureStart({ x, y });
    } else {
      setMeasureEnd({ x, y });
      const distance = calculateDistance(measureStart, { x, y });
      setMeasureDistance(distance);
    }
  };

  return (
    <div className="flex h-screen p-4 gap-4 max-w-full overflow-hidden">
      <div className="flex flex-1 gap-4 flex-col md:flex-row">
        <div className="flex gap-4 flex-row md:flex-col">
          <XRayToolbar
            isMeasuring={isMeasuring}
            setIsMeasuring={setIsMeasuring}
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
                <div className="w-full h-[80vh] overflow-auto">
                  <XRayGrid
                    images={images}
                    startIndex={Math.floor(currentImageIndex / 4) * 4}
                    contrast={contrast}
                    exposure={exposure}
                    onImageClick={handleImageClick}
                    showHeatmap={showHeatmap}
                    zoom={zoom}
                    position={position}
                    measureStart={measureStart}
                    measureEnd={measureEnd}
                    activeImageIndex={currentImageIndex}
                    isMeasuring={isMeasuring}
                    measureDistance={measureDistance}
                  />
                </div>
              ) : (
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                  {isDicomImage(images[currentImageIndex]) ? (
                    <DicomViewer
                      imageId={images[currentImageIndex]}
                      position={position}
                      zoom={zoom}
                    />
                  ) : (
                    <img 
                      ref={imageRef}
                      src={images[currentImageIndex]} 
                      alt="X-Ray"
                      className={`h-full w-full object-contain cursor-move ${showHeatmap ? 'heatmap-filter' : ''}`}
                      onContextMenu={(e) => e.preventDefault()}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={() => setIsDragging(false)}
                      onMouseLeave={() => setIsDragging(false)}
                      onClick={handleImageClick}
                      style={{
                        filter: `contrast(${contrast}%) brightness(${exposure}%)`,
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
                      }}
                    />
                  )}
                  {measureStart && measureEnd && (
                    <svg
                      className="absolute inset-0 pointer-events-none"
                      style={{ 
                        width: '100%', 
                        height: '100%',
                        transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
                      }}
                    >
                      <line
                        x1={`${measureStart.x}%`}
                        y1={`${measureStart.y}%`}
                        x2={`${measureEnd.x}%`}
                        y2={`${measureEnd.y}%`}
                        stroke="#0EA5E9"
                        strokeWidth="2"
                      />
                      <circle
                        cx={`${measureStart.x}%`}
                        cy={`${measureStart.y}%`}
                        r="4"
                        fill="#0EA5E9"
                      />
                      <circle
                        cx={`${measureEnd.x}%`}
                        cy={`${measureEnd.y}%`}
                        r="4"
                        fill="#0EA5E9"
                      />
                    </svg>
                  )}
                  {measureDistance && (
                    <div 
                      className="absolute bg-black/60 px-2 py-1 rounded text-sm text-white"
                      style={{
                        left: `${(measureStart?.x || 0 + (measureEnd?.x || 0)) / 2}%`,
                        top: `${(measureStart?.y || 0 + (measureEnd?.y || 0)) / 2}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      {measureDistance}px
                    </div>
                  )}
                </div>
              )}
              {images.length > 0 && (
                <div className="absolute right-0 top-0 bottom-0 w-24">
                  <XRayQueue
                    images={images}
                    currentIndex={currentImageIndex}
                    onSelect={setCurrentImageIndex}
                  />
                </div>
              )}
            </>
          ) : (
            <ImageUploadHandler onImagesUploaded={handleImagesUploaded} />
          )}
        </div>
      </div>

      <XRayControlPanel
        zoom={zoom}
        setZoom={setZoom}
        showHeatmap={showHeatmap}
        setShowHeatmap={setShowHeatmap}
        onFileUpload={handleImagesUploaded}
      />
    </div>
  );
};

export default XRayViewer;
