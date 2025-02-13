import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ModelSelectionProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
  onRunModel: () => void;
  disabled: boolean;
}

const ModelSelection = ({ selectedModel, onModelSelect, onRunModel, disabled }: ModelSelectionProps) => {
  const { toast } = useToast();

  const handleRunModel = () => {
    if (disabled) {
      toast({
        title: "No image selected",
        description: "Please upload an X-Ray image before running the model",
        variant: "destructive"
      });
      return;
    }
    onRunModel();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-foreground">Model Selection</label>
        <Select value={selectedModel} onValueChange={onModelSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deteccao_fratura_x_ray">Detecção Fratura X-Ray</SelectItem>
            <SelectItem value="deteccao_fratura_O_C_M">Detecção Fratura O_C_M</SelectItem>
            <SelectItem value='deteccao_tumor_cerebral'>Detecção Tumor cerebral RM</SelectItem>
            <SelectItem value='deteccao_segmentacao_recontrucao_tumor_cerebral'>DSR Tumor Cerebral RM</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2 bg-medical/10 hover:bg-medical/20 text-medical"
        onClick={handleRunModel}
        disabled={disabled}
      >
        <Play className="w-4 h-4" />
        Run Model
      </Button>
    </div>
  );
};

export default ModelSelection;