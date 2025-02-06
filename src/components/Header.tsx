import React from 'react';
import { Button } from './ui/button';
import {
  Download,
  Printer,
  Share2,
  Database,
  Network,
  Server,
  AlertCircle,
  Package,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

interface HeaderProps {
  onExportImage: () => void;
}

const Header = ({ onExportImage }: HeaderProps) => {
  const headerTools = [
    { icon: <Download size={20} />, name: 'Export Image', action: onExportImage },
    { icon: <Printer size={20} />, name: 'Print', action: () => window.print() },
    { icon: <Share2 size={20} />, name: 'Share', action: () => {} },
    { icon: <Database size={20} />, name: 'Export DICOM', action: () => {} },
    { icon: <Database size={20} />, name: 'Export Data', action: () => {} },
    { icon: <Package size={20} />, name: 'Export 3D Model', action: () => {} },
    { icon: <Network size={20} />, name: 'Connect Network', action: () => {} },
    { icon: <Server size={20} />, name: 'Connect PACS', action: () => {} },
    { icon: <AlertCircle size={20} />, name: 'Report Problem', action: () => {} },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-2 glass-dark animate-fadeIn border-b border-border/30">
      <div className="flex items-center justify-between max-w-[1920px] mx-auto">
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

        <div className="flex items-center gap-2">
          {headerTools.map((tool, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={tool.action}
                  className="hover:bg-medical/20"
                >
                  {tool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black/80 text-white border-none px-3 py-1.5">
                <p>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;