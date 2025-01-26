import React from 'react';
import { Button } from './ui/button';
import { Printer, Share2, AlertCircle, FileOutput, Database } from 'lucide-react';
import { useToast } from './ui/use-toast';

const XRayActionButtons = () => {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
    toast({ title: "Printing..." });
  };

  const handleShare = () => {
    toast({ title: "Share functionality coming soon" });
  };

  const handleReportError = () => {
    toast({ title: "Error report submitted", description: "Thank you for your feedback" });
  };

  const handleExportResults = () => {
    toast({ title: "Exporting results..." });
  };

  const handleExportData = () => {
    toast({ title: "Exporting data..." });
  };

  return (
    <div className="flex gap-2 p-2 glass-dark rounded-lg animate-fadeIn self-end">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrint}
        className="hover:bg-medical/20 relative group"
        title="Print"
      >
        <Printer size={20} className="text-white" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Print
        </span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className="hover:bg-medical/20 relative group"
        title="Share"
      >
        <Share2 size={20} className="text-white" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Share
        </span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReportError}
        className="hover:bg-medical/20 relative group"
        title="Report Error"
      >
        <AlertCircle size={20} className="text-white" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Report Error
        </span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExportResults}
        className="hover:bg-medical/20 relative group"
        title="Export Results"
      >
        <FileOutput size={20} className="text-white" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Export Results
        </span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExportData}
        className="hover:bg-medical/20 relative group"
        title="Export Data"
      >
        <Database size={20} className="text-white" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Export Data
        </span>
      </Button>
    </div>
  );
};

export default XRayActionButtons;