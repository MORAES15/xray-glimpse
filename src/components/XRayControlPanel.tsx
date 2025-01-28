import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sun, Moon, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';
import ChatContainer from './chat/ChatContainer';
import ModelSelection from './ModelSelection';

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
  onRunModel: () => void;
  hasImages: boolean;
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
  onRunModel,
  hasImages
}: XRayControlPanelProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="w-80 glass-dark rounded-lg p-6 space-y-6 animate-fadeIn hidden md:block">
      <ModelSelection
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        onRunModel={onRunModel}
        disabled={!hasImages}
      />

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