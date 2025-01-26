import { pipeline } from "@huggingface/transformers";

export interface XRayPrediction {
  [key: string]: number;
}

export interface LLMResponse {
  summary: string;
  error?: string;
}

let classifier: any = null;

export const initializeLLM = async () => {
  try {
    // Using a public model that doesn't require authentication
    classifier = await pipeline(
      "text-generation",
      "distilbert-base-uncased",
      { 
        device: "cpu",
        model: {
          revision: "main",
          trust_remote_code: true
        }
      }
    );
    console.log("LLM initialized successfully");
    return true;
  } catch (error) {
    console.error("Failed to initialize LLM:", error);
    return false;
  }
};

const formatPredictionsForPrompt = (predictions: XRayPrediction): string => {
  const sortedPredictions = Object.entries(predictions)
    .sort(([, a], [, b]) => b - a)
    .map(([label, confidence]) => `${label}: ${(confidence * 100).toFixed(1)}%`)
    .join(", ");

  return `X-ray analysis shows: ${sortedPredictions}. Please provide a 2-3 sentence medical interpretation focusing on the most significant findings.`;
};

export const interpretPredictions = async (
  predictions: XRayPrediction
): Promise<LLMResponse> => {
  if (!classifier) {
    return {
      summary: "LLM not initialized. Please wait for system initialization.",
      error: "LLM_NOT_INITIALIZED"
    };
  }

  try {
    const prompt = formatPredictionsForPrompt(predictions);
    const result = await classifier(prompt, {
      max_length: 100,
      temperature: 0.3,
      top_p: 0.9,
    });

    return {
      summary: result[0].generated_text.trim()
    };
  } catch (error) {
    console.error("Error generating interpretation:", error);
    return {
      summary: "Unable to generate interpretation at this time.",
      error: "GENERATION_FAILED"
    };
  }
};