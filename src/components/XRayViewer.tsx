import React, { useState, useRef } from 'react';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayGrid from './XRayGrid';
import XRayToolbar from './XRayToolbar';
import XRayControlPanel from './XRayControlPanel';
import XRayEmptyState from './XRayEmptyState';
import XRaySingleView from './XRaySingleView';
import { useXRayImage } from '@/hooks/useXRayImage';
import { useMeasurement } from '@/hooks/useMeasurement';

const XRayViewer = () => {
  const { toast } = useToast();
  const [aiModel, setAiModel] = useState('');
  const [mode, setMode] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [adjustStart, setAdjustStart] = useState({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  const {
    isMeasuring,
    setIsMeasuring,
    measureStart,
    setMeasureStart,
    measureEnd,
    setMeasureEnd,
    measureDistance,
    setMeasureDistance,
    handleMeasureClick,
    resetMeasurement,
    calculateDistance
  } = useMeasurement();

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

  const handleMouseDown = (e: React.MouseEvent<HTMLImageElement>) => {
    if (e.button === 2) {
      e.preventDefault();
      setAdjustStart({ x: e.clientX, y: e.clientY });
    } else if (e.button === 0) {
      if (isMeasuring) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        handleMeasureClick(x, y);
      } else {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (e.buttons === 2) {
      const deltaX = e.clientX - adjustStart.x;
      const deltaY = e.clientY - adjustStart.y;
      setContrast(prev => Math.max(0, Math.min(200, prev + deltaX / 2)));
      setExposure(prev => Math.max(0, Math.min(200, prev - deltaY / 2)));
      setAdjustStart({ x: e.clientX, y: e.clientY });
    } else if (isDragging && e.buttons === 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (viewerRef.current && !viewerRef.current.contains(e.target as Node)) {
      resetMeasurement();
    }
  };

  React.useEffect(() => {
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
          />
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
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    showHeatmap={showHeatmap}
                    zoom={zoom}
                    position={position}
                    measureStart={measureStart}
                    measureEnd={measureEnd}
                    measureDistance={measureDistance}
                    isMeasuring={isMeasuring}
                  />
                </div>
              ) : (
                <XRaySingleView
                  image={images[currentImageIndex]}
                  contrast={contrast}
                  exposure={exposure}
                  showHeatmap={showHeatmap}
                  zoom={zoom}
                  position={position}
                  isDragging={isDragging}
                  isMeasuring={isMeasuring}
                  measureStart={measureStart}
                  measureEnd={measureEnd}
                  measureDistance={measureDistance}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                />
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
            <XRayEmptyState onFileUpload={handleFileUpload} />
          )}
        </div>
      </div>

      <XRayControlPanel
        aiModel={aiModel}
        setAiModel={setAiModel}
        mode={mode}
        setMode={setMode}
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