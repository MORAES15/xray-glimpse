import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Sun, Moon, Upload } from 'lucide-react';
import { useTheme } from 'next-themes';

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
          <div className="w-12 h-12 rounded-full overflow-hidden bg-medical/10 flex items-center justify-center ring-2 ring-medical/20">
            <img 
              src="/lovable-uploads/c46db37c-b7db-4175-b818-0d049fb39b1c.png" 
              alt="Medfinder Logo" 
              className="w-10 h-10 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-wide">MEDFINDER</h2>
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

      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-xl font-semibold text-foreground">Chat</h2>
        <div className="h-[calc(100vh-36rem)] bg-background/20 rounded-lg p-4 overflow-y-auto">
          <p className="text-muted-foreground text-sm">Chat functionality coming soon...</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-background/20 rounded-lg px-4 py-2 text-foreground placeholder:text-muted-foreground"
            disabled
          />
          <Button 
            className="bg-medical text-white hover:bg-medical-dark disabled:opacity-50"
            disabled
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default XRayControlPanel;