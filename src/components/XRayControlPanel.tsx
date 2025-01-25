import React from 'react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Sun, Moon, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';

interface XRayControlPanelProps {
  aiModel: string;
  setAiModel: (value: string) => void;
  mode: string;
  setMode: (value: string) => void;
  zoom: number;
  setZoom: (value: number) => void;
  showHeatmap: boolean;
  setShowHeatmap: (value: boolean) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

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

const XRayControlPanel = ({
  aiModel,
  setAiModel,
  mode,
  setMode,
  zoom,
  setZoom,
  showHeatmap,
  setShowHeatmap,
  onFileUpload
}: XRayControlPanelProps) => {
  const { theme, setTheme } = useTheme();

  return (
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
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          onChange={onFileUpload}
          className="hidden"
        />
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-medical/50 rounded-lg cursor-pointer hover:bg-medical/10 transition-colors">
          <Upload className="w-5 h-5 mr-2 text-medical" />
          <span className="text-sm font-medium">Upload X-Ray Images</span>
        </div>
      </label>
    </div>
  );
};

export default XRayControlPanel;