import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayGrid from './XRayGrid';
import XRayToolbar from './XRayToolbar';
import XRayControlPanel from './XRayControlPanel';
import DicomMetadataPanel from './DicomMetadataPanel';
import ImageUploadHandler from './ImageUploadHandler';
import DicomViewer from './DicomViewer';
import XRayActionButtons from './XRayActionButtons';
import { useMeasurement } from '../hooks/useMeasurement';
import { initializeDicomLoader, isDicomImage, loadDicomFile } from '../utils/dicomLoader';

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
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const {
    measureStart,
    measureEnd,
    measureDistance,
    isMeasuring,
    handleMeasureClick,
    toggleMeasuring,
    resetMeasurement
  } = useMeasurement();

  useEffect(() => {
    initializeDicomLoader();
  }, []);

  useEffect(() => {
    // Reset measurement when switching views
    resetMeasurement();
  }, [isGridView, resetMeasurement]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if the click is outside any image
      if (!target.closest('img')) {
        resetMeasurement();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [resetMeasurement]);

  const handleImagesUploaded = (newImages: string[]) => {
    if (Array.isArray(newImages) && newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      setCurrentImageIndex(images.length); // Set to the index of the newly added image
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

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
        } else if (file.type.startsWith('image/')) {
          const imageUrl = URL.createObjectURL(file);
          newImages.push(imageUrl);
          toast({
            title: "Image loaded",
            description: `Successfully loaded ${file.name}`,
          });
        } else {
          toast({
            title: "Invalid file type",
            description: "Please upload only image or DICOM files",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error loading file:', error);
        toast({
          title: "Error loading file",
          description: `Failed to load ${file.name}`,
          variant: "destructive"
        });
      }
    }

    handleImagesUploaded(newImages);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMeasuring) {
      return; // Only prevent default behavior when measuring
    }
    
    if (e.button === 2) { // Right click
      setIsAdjusting(true);
      setStartPos({ x: e.clientX, y: e.clientY });
    } else {
      setIsDragging(true);
    }
    // Stop event propagation to prevent the outside click handler from firing
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMeasuring) {
      return; // Only prevent default behavior when measuring
    }

    if (isAdjusting && startPos) {
      const deltaX = e.clientX - startPos.x;
      const deltaY = e.clientY - startPos.y;
      
      setContrast(prev => Math.max(0, Math.min(200, prev + deltaX / 2)));
      setExposure(prev => Math.max(0, Math.min(200, prev - deltaY / 2)));
      
      setStartPos({ x: e.clientX, y: e.clientY });
    } else if (isDragging) {
      const deltaX = e.movementX;
      const deltaY = e.movementY;
      setPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsAdjusting(false);
    setStartPos(null);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>, clickedImageIndex?: number) => {
    if (e.button === 2) { // Right click
      return;
    }
    
    if (isGridView && typeof clickedImageIndex === 'number') {
      setCurrentImageIndex(clickedImageIndex);
    }

    if (isMeasuring) {
      handleMeasureClick(e, isGridView);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full gap-4 p-2 md:p-4 overflow-hidden">
      <div className="flex flex-1 gap-4 min-h-0">
        <div className="flex flex-col gap-4">
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

        <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden relative min-h-0">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              {isGridView ? (
                <div className="w-full h-full overflow-auto">
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
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
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
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
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
                  <div className="absolute bottom-4 left-4 text-white text-sm font-mono bg-black/60 px-2 py-1 rounded">
                    C: {contrast}% | E: {exposure}%
                  </div>
                </div>
              )}
              {images.length > 0 && (
                <div className="absolute right-0 top-0 bottom-0">
                  <XRayQueue
                    images={images}
                    currentIndex={currentImageIndex}
                    onSelect={setCurrentImageIndex}
                  />
                </div>
              )}
            </div>
          ) : (
            <ImageUploadHandler onImagesUploaded={handleImagesUploaded} />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:w-80">
        <XRayActionButtons />
        <XRayControlPanel
          zoom={zoom}
          setZoom={setZoom}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default XRayViewer;
