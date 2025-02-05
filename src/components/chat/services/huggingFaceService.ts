// src/components/chat/services/huggingFaceService.ts

const HUGGINGFACE_API_TOKEN = "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";
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large";

export async function generateResponse(input: string, chatHistory: { sender: string; text: string }[]): Promise<string> {
  try {
    // Constrói o histórico de mensagens no formato adequado
    const formattedHistory = chatHistory
      .map(msg => `${msg.sender === 'user' ? 'User' : 'JamesBot'}: ${msg.text}`)
      .join("\n");

    // Prompt atualizado com contexto
    const prompt = `
      You are JamesBot, a medical AI assistant specialized in radiology and medical imaging.
      You assist doctors, medical students, and healthcare professionals in interpreting X-ray findings
      and providing accurate medical explanations.

      Here is the conversation history:
      ${formattedHistory}

      --- Current User Input ---
      User: "${input}"
      JamesBot:
    `;

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 300, // Mantém respostas concisas
          temperature: 0.5, // Reduz variação para respostas mais confiáveis
          top_p: 0.8,
          do_sample: false, // Garante previsibilidade
          repetition_penalty: 1.2
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text?.trim() || "";

    return generatedText || "I'm sorry, I couldn't generate a response for this X-ray finding.";

  } catch (error) {
    console.error("Error calling HuggingFace API:", error);
    throw error;
  }
}
