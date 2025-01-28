import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sun, Moon, Upload, Play } from 'lucide-react';
import { useTheme } from 'next-themes';
import ChatContainer from './chat/ChatContainer';

interface XRayControlPanelProps {
  zoom: number;
  setZoom: (value: number) => void;
  showHeatmap: boolean;
  setShowHeatmap: (value: boolean) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exposure: number;
  setExposure: (value: number) => void;
  contrast: number;
  setContrast: (value: number) => void;
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  visualizationPreset: string;
  setVisualizationPreset: (value: string) => void;
}

const XRayControlPanel = ({
  zoom,
  setZoom,
  showHeatmap,
  setShowHeatmap,
  onFileUpload,
  exposure,
  setExposure,
  contrast,
  setContrast,
  selectedModel,
  setSelectedModel,
  visualizationPreset,
  setVisualizationPreset
}: XRayControlPanelProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-80 glass-dark rounded-lg p-6 space-y-6 animate-fadeIn hidden md:block">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-foreground">Model Selection</label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chest-xray">Chest X-Ray Detection</SelectItem>
              <SelectItem value="bone-fracture">Bone Fracture Detection</SelectItem>
              <SelectItem value="pneumonia">Pneumonia Detection</SelectItem>
              <SelectItem value="tuberculosis">Tuberculosis Detection</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground">Visualization Preset</label>
          <Select value={visualizationPreset} onValueChange={setVisualizationPreset}>
            <SelectTrigger>
              <SelectValue placeholder="Select preset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lung">Lung Preset</SelectItem>
              <SelectItem value="bone">Bone Preset</SelectItem>
              <SelectItem value="soft-tissue">Soft Tissue Preset</SelectItem>
              <SelectItem value="mediastinum">Mediastinum Preset</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 bg-medical/10 hover:bg-medical/20 text-medical"
          onClick={() => {
            // Add model running logic here
          }}
        >
          <Play className="w-4 h-4" />
          Run Model
        </Button>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="w-full text-foreground border-border hover:bg-accent flex items-center justify-center gap-2"
      >
        {theme === 'dark' ? (
          <>
            <Sun className="h-5 w-5" />
            <span>Switch to Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-5 w-5" />
            <span>Switch to Dark Mode</span>
          </>
        )}
      </Button>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-foreground">Zoom: {zoom}%</label>
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={50}
            max={200}
            step={1}
            className="py-4"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-foreground">Image Exposure: {exposure}%</label>
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
          <label className="text-sm text-foreground">Image Contrast: {contrast}%</label>
          <Slider
            value={[contrast]}
            onValueChange={([value]) => setContrast(value)}
            min={0}
            max={200}
            step={1}
            className="py-4"
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full text-foreground border-border hover:bg-accent"
        onClick={() => setShowHeatmap(!showHeatmap)}
      >
        {showHeatmap ? 'Disable Heatmap' : 'Enable Heatmap'}
      </Button>

      <label className="block w-full">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFileUpload}
          className="hidden"
        />
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-medical/50 rounded-lg cursor-pointer hover:bg-medical/10 transition-colors text-foreground">
          <Upload className="w-5 h-5 mr-2 text-medical" />
          <span className="text-sm font-medium">Upload X-Ray Images</span>
        </div>
      </label>

      <div className="border-t border-border pt-4">
        <ChatContainer />
      </div>
    </div>
  );
};

export default XRayControlPanel;