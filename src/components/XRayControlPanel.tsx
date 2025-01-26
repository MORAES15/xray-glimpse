import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sun, Moon, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';
import ChatContainer from './chat/ChatContainer';

interface XRayControlPanelProps {
  zoom: number;
  setZoom: (value: number) => void;
  showHeatmap: boolean;
  setShowHeatmap: (value: boolean) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const XRayControlPanel = ({
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
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-medical/10 flex items-center justify-center ring-2 ring-medical/20">
            <img 
              src="/lovable-uploads/c46db37c-b7db-4175-b818-0d049fb39b1c.png" 
              alt="Medfinder Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="text-4xl font-bold text-foreground tracking-wide">MEDFINDER</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="text-foreground hover:text-foreground/80"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

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