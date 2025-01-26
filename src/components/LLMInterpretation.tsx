import React from 'react';
import { useToast } from './ui/use-toast';
import { Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface LLMInterpretationProps {
  predictions?: Record<string, number>;
  isLoading?: boolean;
}

const LLMInterpretation: React.FC<LLMInterpretationProps> = ({
  predictions,
  isLoading = false
}) => {
  const { toast } = useToast();
  const [interpretation, setInterpretation] = React.useState<string>("");
  const [interpreting, setInterpreting] = React.useState(false);

  const handleInterpret = async () => {
    if (!predictions) {
      toast({
        title: "No predictions available",
        description: "Please run the model first to get predictions.",
        variant: "destructive"
      });
      return;
    }

    setInterpreting(true);
    try {
      const { interpretPredictions } = await import('../utils/llmInterpreter');
      const result = await interpretPredictions(predictions);
      
      if (result.error) {
        toast({
          title: "Interpretation failed",
          description: "Could not generate interpretation. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setInterpretation(result.summary);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate interpretation",
        variant: "destructive"
      });
    } finally {
      setInterpreting(false);
    }
  };

  return (
    <Card className="p-4 bg-black/80 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">AI Interpretation</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleInterpret}
          disabled={isLoading || interpreting || !predictions}
          className="gap-2"
        >
          <Brain size={16} />
          {interpreting ? "Analyzing..." : "Interpret"}
        </Button>
      </div>
      
      {interpretation ? (
        <p className="text-sm leading-relaxed">{interpretation}</p>
      ) : (
        <p className="text-sm text-gray-400">
          Click interpret to get AI analysis of the X-ray findings.
        </p>
      )}
    </Card>
  );
};

export default LLMInterpretation;