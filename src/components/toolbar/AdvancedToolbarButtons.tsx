import React from 'react';
import { Button } from '../ui/button';
import { 
  Printer,
  Share2,
  FileText,
  Database,
  Network,
  Server,
  AlertCircle,
  Download
} from 'lucide-react';
import VolumetricAnalysisButton from './VolumetricAnalysisButton';
import CommentButton from './CommentButton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from '../ui/use-toast';

interface AdvancedToolbarButtonsProps {
  onExportImage: () => void;
}

const AdvancedToolbarButtons = ({ onExportImage }: AdvancedToolbarButtonsProps) => {
  const { toast } = useToast();

  const tools = [
    {
      component: <VolumetricAnalysisButton />,
      name: 'Volumetric Analysis'
    },
    {
      component: <CommentButton />,
      name: 'Add Comment'
    },
    { 
      icon: <Download size={20} className="text-white" />, 
      name: 'Export Image', 
      action: onExportImage
    },
    { 
      icon: <Printer size={20} className="text-white" />, 
      name: 'Print', 
      action: () => {
        window.print();
        toast({ title: "Printing..." });
      }
    },
    { 
      icon: <Share2 size={20} className="text-white" />, 
      name: 'Share', 
      action: () => toast({ title: "Share feature coming soon" })
    },
    { 
      icon: <FileText size={20} className="text-white" />, 
      name: 'Export DICOM', 
      action: () => toast({ title: "DICOM export feature coming soon" })
    },
    { 
      icon: <Database size={20} className="text-white" />, 
      name: 'Export Data', 
      action: () => toast({ title: "Data export feature coming soon" })
    },
    { 
      icon: <Network size={20} className="text-white" />, 
      name: 'Connect Network', 
      action: () => toast({ title: "Network connection feature coming soon" })
    },
    { 
      icon: <Server size={20} className="text-white" />, 
      name: 'Connect PACS', 
      action: () => toast({ title: "PACS connection feature coming soon" })
    },
    { 
      icon: <AlertCircle size={20} className="text-white" />, 
      name: 'Report Problem', 
      action: () => toast({ title: "Problem report feature coming soon" })
    },
  ];

  return (
    <>
      {tools.map((tool, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <div>
              {tool.component || (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={tool.action}
                  className="hover:bg-medical/20"
                >
                  {tool.icon}
                </Button>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-black/80 text-white border-none px-3 py-1.5">
            <p>{tool.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </>
  );
};

export default AdvancedToolbarButtons;