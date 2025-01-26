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
    // For now just show a toast - could be expanded to actual sharing functionality
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
    <div className="flex gap-2 p-2 glass-dark rounded-lg animate-fadeIn">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrint}
        className="hover:bg-medical/20"
        title="Print"
      >
        <Printer size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleShare}
        className="hover:bg-medical/20"
        title="Share"
      >
        <Share2 size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleReportError}
        className="hover:bg-medical/20"
        title="Report Error"
      >
        <AlertCircle size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExportResults}
        className="hover:bg-medical/20"
        title="Export Results"
      >
        <FileOutput size={20} className="text-white" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleExportData}
        className="hover:bg-medical/20"
        title="Export Data"
      >
        <Database size={20} className="text-white" />
      </Button>
    </div>
  );
};

export default XRayActionButtons;