import React, { useState } from 'react';
import { 
  Upload, 
  Sun, 
  Moon, 
  ZoomIn, 
  Contrast, 
  SunDim,
  Ruler,
  Maximize,
  Move
} from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from './ui/use-toast';

const XRayViewer = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [aiModel, setAiModel] = useState('');
  const [mode, setMode] = useState('');
  const [sensitivity, setSensitivity] = useState(50);
  const [focus, setFocus] = useState(50);
  const [noiseCancellation, setNoiseCancellation] = useState(50);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [contrast, setContrast] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showHeatmap, setShowHeatmap] = useState(false);

  const aiModels = [
    'T3Alpha 1.0.2',
    'BTAlpha 0.0.4',
    'HAAlpha 0.0.6'
  ];

  const modes = ['Standard', 'High Contrast', 'Bone Enhancement', 'Soft Tissue'];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      toast({
        title: "Image uploaded",
        description: "X-Ray image has been loaded successfully.",
      });
    }
  };

  const tools = [
    { icon: <Contrast size={20} />, name: 'Contrast', action: () => {
      setContrast(prev => Math.min(200, prev + 10));
      toast({ title: "Contrast increased" });
    }},
    { icon: <SunDim size={20} />, name: 'Exposure', action: () => {
      setExposure(prev => Math.min(200, prev + 10));
      toast({ title: "Exposure increased" });
    }},
    { icon: <ZoomIn size={20} />, name: 'Zoom', action: () => {
      setZoom(prev => Math.min(200, prev + 10));
      toast({ title: "Zoom increased" });
    }},
    { icon: <Ruler size={20} />, name: 'Measure', action: () => {
      toast({ title: "Measurement mode activated" });
    }},
    { icon: <Move size={20} />, name: 'Pan', action: () => {
      toast({ title: "Pan mode activated" });
    }},
    { icon: <Maximize size={20} />, name: 'Fit Screen', action: () => {
      setZoom(100);
      setPosition({ x: 0, y: 0 });
      toast({ title: "Image reset to fit screen" });
    }},
  ];

  return (
    <div className="flex h-screen p-4 gap-4">
      {/* Main viewing area */}
      <div className="flex flex-1 gap-4">
        {/* Tools sidebar */}
        <div className="flex flex-col gap-2 p-2 glass-dark rounded-lg animate-fadeIn">
          {tools.map((tool) => (
            <Button
              key={tool.name}
              variant="ghost"
              size="icon"
              onClick={tool.action}
              className="hover:bg-medical/20"
              title={tool.name}
            >
              {tool.icon}
            </Button>
          ))}
        </div>

        {/* Viewing window */}
        <div className="flex-1 bg-black/90 rounded-lg flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <div className="relative w-full h-[80vh] flex items-center justify-center">
              <img 
                src={imageUrl} 
                alt="X-Ray"
                className="h-full w-full object-contain cursor-move"
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setDragStart({
                    x: e.clientX - position.x,
                    y: e.clientY - position.y
                  });
                }}
                onMouseMove={(e) => {
                  if (isDragging) {
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
              {showHeatmap && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(circle at 50% 60%, rgba(255,0,0,0.8), transparent 40%),
                      radial-gradient(circle at 45% 55%, rgba(255,255,0,0.7), transparent 30%),
                      radial-gradient(circle at 55% 65%, rgba(255,69,0,0.75), transparent 35%)
                    `,
                    mixBlendMode: 'screen'
                  }}
                />
              )}
            </div>
          ) : (
            <div className="text-gray-500 flex flex-col items-center gap-4">
              <Upload size={48} className="text-medical" />
              <span>Upload an X-Ray image to begin</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls panel */}
      <div className="w-80 glass-dark rounded-lg p-6 space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">Controls</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="hover:bg-medical/20"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">AI Model</label>
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-full bg-black/20">
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
              <SelectTrigger className="w-full bg-black/20">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
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
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-medical/50 rounded-lg cursor-pointer hover:bg-medical/10 transition-colors">
            <Upload className="w-5 h-5 mr-2 text-medical" />
            <span className="text-sm font-medium">Upload X-Ray Image</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default XRayViewer;