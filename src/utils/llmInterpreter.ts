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
    classifier = await pipeline("text-generation", "distilgpt2");
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
      pad_token_id: 50256
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