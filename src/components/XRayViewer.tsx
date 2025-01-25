import React, { useState, useRef, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayGrid from './XRayGrid';
import XRayToolbar from './XRayToolbar';
import XRayControlPanel from './XRayControlPanel';
import DicomMetadataPanel from './DicomMetadataPanel';
import { initializeDicomLoader, loadDicomFile, isDicomImage } from '../utils/dicomLoader';

const XRayViewer = () => {
  const { toast } = useToast();
  const [aiModel, setAiModel] = useState('');
  const [mode, setMode] = useState('');
  const [sensitivity, setSensitivity] = useState(50);
  const [focus, setFocus] = useState(50);
  const [noiseCancellation, setNoiseCancellation] = useState(50);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measureStart, setMeasureStart] = useState<{ x: number; y: number } | null>(null);
  const [measureEnd, setMeasureEnd] = useState<{ x: number; y: number } | null>(null);
  const [measureDistance, setMeasureDistance] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(false);
  const [adjustStart, setAdjustStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeDicomLoader();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];
      
      for (const file of Array.from(files)) {
        try {
          if (file.type === 'application/dicom' || file.name.endsWith('.dcm')) {
            const imageId = await loadDicomFile(file);
            newImages.push(imageId);
          } else {
            newImages.push(URL.createObjectURL(file));
          }
        } catch (error) {
          toast({
            title: "Error loading file",
            description: `Failed to load ${file.name}. Make sure it's a valid image or DICOM file.`,
            variant: "destructive"
          });
        }
      }
      
      setImages(prev => [...prev, ...newImages]);
      if (images.length === 0) {
        setCurrentImageIndex(0);
      }
      
      toast({
        title: `${newImages.length} file(s) uploaded`,
        description: "Images have been loaded successfully.",
      });
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
      toast({ title: "Start point set" });
    } else {
      setMeasureEnd({ x, y });
      const distance = calculateDistance(measureStart, { x, y });
      setMeasureDistance(distance);
      toast({ title: `Distance: ${distance}px` });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isMeasuring) {
      handleImageClick(e);
      return;
    }

    if (e.button === 2) {
      e.preventDefault();
      setAdjustStart({ x: e.clientX, y: e.clientY });
    } else if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (e.buttons === 2) {
      const deltaX = e.clientX - adjustStart.x;
      const deltaY = e.clientY - adjustStart.y;
      setContrast(prev => Math.max(0, Math.min(200, prev + deltaX / 2)));
      setExposure(prev => Math.max(0, Math.min(200, prev - deltaY / 2)));
      setAdjustStart({ x: e.clientX, y: e.clientY });
    } else if (isDragging && e.buttons === 0) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (viewerRef.current && !viewerRef.current.contains(e.target as Node)) {
      setIsMeasuring(false);
      setMeasureStart(null);
      setMeasureEnd(null);
      setMeasureDistance(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden relative" ref={viewerRef}>
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
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
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
                      {measureDistance && (
                        <text
                          x={`${(measureStart.x + measureEnd.x) / 2}%`}
                          y={`${(measureStart.y + measureEnd.y) / 2}%`}
                          fill="#0EA5E9"
                          fontSize="12"
                          fontWeight="bold"
                          dominantBaseline="central"
                          textAnchor="middle"
                        >
                          {measureDistance}px
                        </text>
                      )}
                    </svg>
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
            <div className="text-gray-500 flex flex-col items-center gap-4">
              <Upload size={48} className="text-medical" />
              <span>Upload X-Ray images to begin</span>
              <label className="cursor-pointer hover:text-medical">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Click to upload
              </label>
            </div>
          )}
        </div>
      </div>

      <XRayControlPanel
        aiModel={aiModel}
        setAiModel={setAiModel}
        mode={mode}
        setMode={setMode}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
        focus={focus}
        setFocus={setFocus}
        noiseCancellation={noiseCancellation}
        setNoiseCancellation={setNoiseCancellation}
        zoom={zoom}
        setZoom={setZoom}
        showHeatmap={showHeatmap}
        setShowHeatmap={setShowHeatmap}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default XRayViewer;