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

// Define the arrays
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
  const [adjustStart, setAdjustStart] = useState({ x: 0, y: 0 });
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

  
  const [scale, setScale] = useState({ x: 1, y: 1 });

  useEffect(() => {
    const updateScale = () => {
        if (imageRef.current && imageRef.current.naturalWidth > 0) {
            const rect = imageRef.current.getBoundingClientRect();
            setScale({
                x: imageRef.current.naturalWidth / rect.width,
                y: imageRef.current.naturalHeight / rect.height
            });
        }
    };

    if (imageRef.current) {
        imageRef.current.addEventListener('load', updateScale); // Atualiza quando a imagem carrega
        updateScale(); // Atualiza imediatamente se a imagem já estiver carregada
    }

    return () => {
        if (imageRef.current) {
            imageRef.current.removeEventListener('load', updateScale);
        }
    };
}, [zoom, images, currentImageIndex]); // Atualiza quando o zoom ou imagem muda
  const calculateDistance = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    if (!start || !end) return "0";

    // Cálculo simples da distância entre os dois pontos
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
};

const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
  if (!isMeasuring || !imageRef.current) return;

  const rect = imageRef.current.getBoundingClientRect();
  const naturalWidth = imageRef.current.naturalWidth;
  const naturalHeight = imageRef.current.naturalHeight;

  // Coordenadas relativas à imagem ORIGINAL (sem zoom/posição)
  const x = ((e.clientX - rect.left) / rect.width) * naturalWidth;
  const y = ((e.clientY - rect.top) / rect.height) * naturalHeight;

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
  if (e.button === 2) { // Botão direito para ajustes
    e.preventDefault();
    setAdjustStart({ x: e.clientX, y: e.clientY });
  } else if (e.button === 0) { // Botão esquerdo
    if (isMeasuring) {
      // Chama handleImageClick manualmente para medição
      handleImageClick(e);
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
  if (e.buttons === 2) { // Apenas botão direito pressionado
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

const XRayGrid = ({ images, startIndex }: { images: string[]; startIndex: number }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
      {images.slice(startIndex, startIndex + 4).map((img, index) => (
        <div 
          key={index}
          className="relative aspect-square bg-black/20 rounded-lg overflow-hidden"
        >
          <img
            src={img}
            alt={`Grid item ${index}`}
            className="object-contain w-full h-full p-2"
          />
        </div>
      ))}
    </div>
  );
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
    { 
      icon: <ContrastExposureControl 
        onContrastChange={setContrast} 
        onExposureChange={setExposure} 
      />, 
      name: 'Contrast/Exposure',
      action: () => {
        toast({ 
          title: "Clique e arraste com o botão DIREITO para ajustar contraste/exposição"
        });
      }
    },
    { 
      icon: <ZoomIn size={20} className="text-white" />, 
      name: 'Zoom', 
      action: () => {
        setZoom(prev => Math.min(200, prev + 10));
        toast({ title: "Zoom increased" });
      }
    },
    { 
      icon: <Ruler size={20} className="text-white" />, 
      name: 'Measure', 
      action: () => {
        setIsMeasuring(!isMeasuring);
        if (!isMeasuring) {
          setMeasureStart(null);
          setMeasureEnd(null);
          setMeasureDistance(null);
          toast({ title: "Click two points to measure distance" });
        }
      }
    },
    { 
      icon: <Move size={20} className="text-white" />, 
      name: 'Pan', 
      action: () => {
        setIsDragging(false);
        toast({ title: "Pan mode activated" });
      }
    },
    { 
      icon: <Maximize size={20} className="text-white" />, 
      name: 'Fit Screen', 
      action: () => {
        setZoom(100);
        setPosition({ x: 0, y: 0 });
        toast({ title: "Image reset to fit screen" });
      }
    },
    { 
      icon: <Grid2X2 size={20} className="text-white" />, 
      name: 'Grid View', 
      action: () => {
        setIsGridView(!isGridView);
        toast({ title: isGridView ? "Single view activated" : "Grid view activated" });
      }
    },
  ];

  return (
    <div className="flex h-screen p-4 gap-4 max-w-full overflow-hidden">
      <div className="flex flex-1 gap-4 flex-col md:flex-row">
        {/* Seção de ferramentas corrigida */}
        <div className="flex gap-4 flex-row md:flex-col">
          <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn">
            {tools.map((tool, index) => (
              <div key={index}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={tool.action}
                  className={`hover:bg-medical/20 ${
                    (tool.name === 'Measure' && isMeasuring) ? 'bg-medical/20' : ''
                  }`}
                  title={tool.name}
                >
                  {tool.icon}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden relative" ref={viewerRef}>
          {images.length > 0 ? (
            <>
              {isGridView ? (
  <div className="w-full h-[80vh] overflow-auto">
    <XRayGrid
      images={images}
      startIndex={Math.floor(currentImageIndex / 4) * 4}
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
      x1={`${(measureStart.x / imageRef.current!.naturalWidth) * 100}%`}
      y1={`${(measureStart.y / imageRef.current!.naturalHeight) * 100}%`}
      x2={`${(measureEnd.x / imageRef.current!.naturalWidth) * 100}%`}
      y2={`${(measureEnd.y / imageRef.current!.naturalHeight) * 100}%`}
      stroke="#0EA5E9"
      strokeWidth="2"
    />
    <circle
      cx={`${(measureStart.x / imageRef.current!.naturalWidth) * 100}%`}
      cy={`${(measureStart.y / imageRef.current!.naturalHeight) * 100}%`}
      r="4"
      fill="#0EA5E9"
    />
    <circle
      cx={`${(measureEnd.x / imageRef.current!.naturalWidth) * 100}%`}
      cy={`${(measureEnd.y / imageRef.current!.naturalHeight) * 100}%`}
      r="4"
      fill="#0EA5E9"
    />
    <text
      x={`${((measureStart.x + measureEnd.x) / (2 * imageRef.current!.naturalWidth)) * 100}%`}
      y={`${((measureStart.y + measureEnd.y) / (2 * imageRef.current!.naturalHeight)) * 100}%`}
      fill="#0EA5E9"
      fontSize="12"
      fontWeight="bold"
      dominantBaseline="central"
      textAnchor="middle"
    >
      {measureDistance}px
    </text>
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

      <div className="w-80 glass-dark rounded-lg p-6 space-y-6 animate-fadeIn hidden md:block">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Controls</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun /> : <Moon />}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">AI Model</label>
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-full bg-black/20 text-white">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Viewing Mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-full bg-black/20 text-white">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m} value={m}>
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