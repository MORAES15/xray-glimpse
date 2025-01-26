import React from 'react';
import { Button } from '../ui/button';
import { Box } from 'lucide-react';
import { useToast } from '../ui/use-toast';

const VolumetricAnalysisButton = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: "Coming Soon",
      description: "Volumetric analysis feature is under development",
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="hover:bg-medical/20"
      title="Volumetric Analysis"
    >
      <Box size={20} className="text-white" />
    </Button>
  );
};

export default VolumetricAnalysisButton;