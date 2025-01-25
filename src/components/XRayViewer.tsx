import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Sun, 
  Moon, 
  ZoomIn,
  Ruler,
  Maximize,
  Move,
  Grid2X2
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';
import XRayQueue from './XRayQueue';
import XRayGrid from './XRayGrid';
import ContrastExposureControl from './ContrastExposureControl';
import { useTheme } from 'next-themes';

// Define the missing arrays
const aiModels = [
  'General Purpose X-Ray AI',
  'Chest X-Ray Specialist',
  'Bone Fracture Detection',
  'Dental X-Ray Analysis',
  'Mammography AI'
];

const modes = [
  'Standard',
  'High Contrast',
  'Bone Focus',
  'Soft Tissue',
  'Edge Detection'
];

const XRayViewer = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
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
  const imageRef = useRef<HTMLImageElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

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

  const calculateDistance = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    if (!imageRef.current) return "0";
    const rect = imageRef.current.getBoundingClientRect();
    const scale = imageRef.current.naturalWidth / rect.width;
    const dx = (end.x - start.x) * scale;
    const dy = (end.y - start.y) * scale;
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isMeasuring) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

  const tools = [
    { icon: <ContrastExposureControl onContrastChange={setContrast} onExposureChange={setExposure} />, name: 'Contrast/Exposure' },
    { icon: <ZoomIn size={20} className="text-white" />, name: 'Zoom', action: () => {
      setZoom(prev => Math.min(200, prev + 10));
      toast({ title: "Zoom increased" });
    }},
    { icon: <Ruler size={20} className="text-white" />, name: 'Measure', action: () => {
      setIsMeasuring(true);
      toast({ title: "Click two points to measure distance" });
    }},
    { icon: <Move size={20} className="text-white" />, name: 'Pan', action: () => {
      toast({ title: "Pan mode activated" });
    }},
    { icon: <Maximize size={20} className="text-white" />, name: 'Fit Screen', action: () => {
      setZoom(100);
      setPosition({ x: 0, y: 0 });
      toast({ title: "Image reset to fit screen" });
    }},
    { icon: <Grid2X2 size={20} className="text-white" />, name: 'Grid View', action: () => {
      setIsGridView(!isGridView);
      toast({ title: isGridView ? "Single view activated" : "Grid view activated" });
    }},
  ];

  return (
    <div className="flex h-screen p-4 gap-4 max-w-full overflow-hidden">
      <div className="flex flex-1 gap-4 flex-col md:flex-row">
        <div className="flex gap-4 flex-row md:flex-col">
          <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn">
            {tools.map((tool, index) => (
              <div key={index}>
                {typeof tool.icon === 'object' && React.isValidElement(tool.icon) ? (
                  tool.icon
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={tool.action}
                    className="hover:bg-medical/20"
                    title={tool.name}
                  >
                    {tool.icon}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden relative" ref={viewerRef}>
          {images.length > 0 ? (
            <>
              {isGridView ? (
                <XRayGrid
                  images={images}
                  startIndex={Math.floor(currentImageIndex / 4) * 4}
                />
              ) : (
                <div className="relative w-full h-[80vh] flex items-center justify-center">
                  <img 
                    ref={imageRef}
                    src={images[currentImageIndex]} 
                    alt="X-Ray"
                    className="h-full w-full object-contain cursor-move"
                    onClick={handleImageClick}
                    onMouseDown={(e) => {
                      if (!isMeasuring) {
                        setIsDragging(true);
                        setDragStart({
                          x: e.clientX - position.x,
                          y: e.clientY - position.y
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      if (isDragging && !isMeasuring) {
                        setPosition({
                          x: e.clientX - dragStart.x,
                          y: e.clientY - dragStart.y
                        });
                      }
                    }}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    style={{
                      filter: `contrast(${contrast}%) brightness(${exposure}%)`,
                      transform: `translate(${position.x}px, ${position.y}px) scale(${zoom/100})`
                    }}
                  />
                  {measureStart && (
                    <div 
                      className="absolute w-2 h-2 bg-medical rounded-full pointer-events-none"
                      style={{ 
                        left: measureStart.x - 4,
                        top: measureStart.y - 4
                      }}
                    />
                  )}
                  {measureStart && measureEnd && (
                    <>
                      <svg
                        className="absolute inset-0 pointer-events-none"
                        style={{ width: '100%', height: '100%' }}
                      >
                        <line
                          x1={measureStart.x}
                          y1={measureStart.y}
                          x2={measureEnd.x}
                          y2={measureEnd.y}
                          stroke="#0EA5E9"
                          strokeWidth="2"
                        />
                      </svg>
                      {measureDistance && (
                        <div 
                          className="absolute bg-medical text-white px-2 py-1 rounded text-sm pointer-events-none"
                          style={{
                            left: (measureStart.x + measureEnd.x) / 2,
                            top: (measureStart.y + measureEnd.y) / 2,
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {measureDistance}px
                        </div>
                      )}
                    </>
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
            </div>
          )}
        </div>
      </div>

      <div className="w-80 glass-dark rounded-lg p-6 space-y-6 animate-fadeIn hidden md:block">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Controls</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-medical/20"
          >
            {theme === 'dark' ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-white" />}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">AI Model</label>
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-full bg-black/20 text-white">
                <SelectValue placeholder="Select AI Model" className="text-white" />
              </SelectTrigger>
              <SelectContent className="bg-medical-darker">
                {aiModels.map((m) => (
                  <SelectItem key={m} value={m} className="text-white hover:bg-medical/20">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Viewing Mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-full bg-black/20 text-white">
                <SelectValue placeholder="Select mode" className="text-white" />
              </SelectTrigger>
              <SelectContent className="bg-medical-darker">
                {modes.map((m) => (
                  <SelectItem key={m} value={m} className="text-white hover:bg-medical/20">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Sensitivity: {sensitivity}%</label>
            <Slider
              value={[sensitivity]}
              onValueChange={([value]) => setSensitivity(value)}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Focus: {focus}%</label>
            <Slider
              value={[focus]}
              onValueChange={([value]) => setFocus(value)}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Noise Cancellation: {noiseCancellation}%</label>
            <Slider
              value={[noiseCancellation]}
              onValueChange={([value]) => setNoiseCancellation(value)}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Contrast: {contrast}%</label>
            <Slider
              value={[contrast]}
              onValueChange={([value]) => setContrast(value)}
              min={0}
              max={200}
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Exposure: {exposure}%</label>
            <Slider
              value={[exposure]}
              onValueChange={([value]) => setExposure(value)}
              min={0}
              max={200}
              step={1}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Zoom: {zoom}%</label>
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={50}
              max={200}
              step={1}
              className="py-4"
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowHeatmap(!showHeatmap)}
        >
          {showHeatmap ? 'Disable Heatmap' : 'Enable Heatmap'}
        </Button>

        <label className="block w-full">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-medical/50 rounded-lg cursor-pointer hover:bg-medical/10 transition-colors">
            <Upload className="w-5 h-5 mr-2 text-medical" />
            <span className="text-sm font-medium">Upload X-Ray Images</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default XRayViewer;