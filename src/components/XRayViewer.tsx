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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [contrast, setContrast] = useState(100);
  const [exposure, setExposure] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [mode, setMode] = useState('standard');

  const modes = [
    { value: 'standard', label: 'Standard' },
    { value: 'bone', label: 'Bone Enhancement' },
    { value: 'tissue', label: 'Soft Tissue' },
    { value: 'contrast', label: 'High Contrast' }
  ];

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
    { icon: <Contrast size={20} />, name: 'Contrast', action: () => {} },
    { icon: <SunDim size={20} />, name: 'Exposure', action: () => {} },
    { icon: <ZoomIn size={20} />, name: 'Zoom', action: () => {} },
    { icon: <Ruler size={20} />, name: 'Measure', action: () => {} },
    { icon: <Move size={20} />, name: 'Pan', action: () => {} },
    { icon: <Maximize size={20} />, name: 'Fit Screen', action: () => {} },
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
            <img 
              src={imageUrl} 
              alt="X-Ray"
              className="max-h-full max-w-full object-contain transition-all duration-200"
              style={{
                filter: `contrast(${contrast}%) brightness(${exposure}%)`,
                transform: `scale(${zoom/100})`
              }}
            />
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
            <label className="text-sm text-gray-300">Viewing Mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-full bg-black/20">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {modes.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <label className="block w-full mt-6">
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