import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayGrid from './XRayGrid';
import XRayToolbar from './XRayToolbar';
import XRayControlPanel from './XRayControlPanel';
import DicomMetadataPanel from './DicomMetadataPanel';
import ImageUploadHandler from './ImageUploadHandler';
import DicomViewer from './DicomViewer';
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
    // Reset measurement when switching views
    resetMeasurement();
  }, [isGridView, resetMeasurement]);

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
    if (isMeasuring) return;
    
    if (e.button === 2) { // Right click
      setIsAdjusting(true);
      setStartPos({ x: e.clientX, y: e.clientY });
    } else {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMeasuring) return;

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

  const calculateRelativePosition = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const rect = target.getBoundingClientRect();
    
    // Calculate the scaled dimensions
    const scaleX = target.naturalWidth / (rect.width * (zoom / 100));
    const scaleY = target.naturalHeight / (rect.height * (zoom / 100));
    
    // Adjust for current position and zoom
    const adjustedX = (e.clientX - rect.left - position.x) * scaleX;
    const adjustedY = (e.clientY - rect.top - position.y) * scaleY;
    
    // Convert to percentage
    const x = (adjustedX / target.naturalWidth) * 100;
    const y = (adjustedY / target.naturalHeight) * 100;
    
    return { x, y };
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>, clickedImageIndex?: number) => {
    if (e.button === 2) { // Right click
      toggleMeasuring(false);
      return;
    }
    
    if (isGridView && typeof clickedImageIndex === 'number') {
      setCurrentImageIndex(clickedImageIndex);
    }

    if (isMeasuring) {
      const pos = calculateRelativePosition(e);
      if (!measureStart) {
        setMeasureStart(pos);
        setMeasureEnd(null);
        setMeasureDistance(null);
      } else {
        setMeasureEnd(pos);
        const dx = pos.x - measureStart.x;
        const dy = pos.y - measureStart.y;
        const distance = Math.sqrt(dx * dx + dy * dy).toFixed(2);
        setMeasureDistance(distance);
      }
    } else {
      handleMeasureClick(e, isGridView);
    }
  };

  const handleExportImage = () => {
    const imageElement = document.querySelector('.image-container img') as HTMLImageElement;
    if (!imageElement) {
      toast({ 
        title: "Export failed",
        description: "No image found to export",
        variant: "destructive"
      });
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match the image
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;
    
    if (ctx) {
      // Draw the image with its current filters
      ctx.filter = imageElement.style.filter;
      ctx.drawImage(imageElement, 0, 0);
      
      // Get the SVG element containing measurements
      const svgElement = document.querySelector('.measurement-overlay') as SVGElement;
      if (svgElement) {
        // Convert SVG to image and draw it on top
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Create download link
          const link = document.createElement('a');
          link.download = 'xray-export.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
          URL.revokeObjectURL(svgUrl);
        };
        img.src = svgUrl;
      } else {
        // If no measurements, just export the image
        const link = document.createElement('a');
        link.download = 'xray-export.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      
      toast({ 
        title: "Image exported successfully",
        description: "The image has been downloaded with all current modifications"
      });
    }
  };

  return (
    <div 
      className="flex h-screen p-4 gap-4 max-w-full overflow-hidden" 
      onContextMenu={(e) => e.preventDefault()}
    >
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
            onExportImage={handleExportImage}
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
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                  {isDicomImage(images[currentImageIndex]) ? (
                    <DicomViewer
                      imageId={images[currentImageIndex]}
                      position={position}
                      zoom={zoom}
                    />
                  ) : (
                    <div className="image-container">
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
                    </div>
                  )}
                  {measureStart && measureEnd && (
                    <svg
                      className="absolute inset-0 pointer-events-none measurement-overlay"
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

      <div className="flex gap-4">
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