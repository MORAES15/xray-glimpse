const LOCAL_API_URL = "http://localhost:1234/v1/completions"; // Atualize para o endpoint correto

export async function generateResponse(input: string, chatHistory: { sender: string; text: string }[], isNewSession: boolean): Promise<string> {
  try {
    // Formata o histórico de mensagens, mas não o inclui explicitamente no prompt
    const formattedHistory = isNewSession
      ? ""
      : chatHistory
          .map(msg => `${msg.sender === 'user' ? 'User' : 'JamesBot'}: ${msg.text}`)
          .join("\n");

    // Prompt atualizado com contexto implícito
    const prompt = `You are JamesBot, a medical AI assistant specialized in radiology and medical imaging. 
You assist doctors, medical students, and healthcare professionals in interpreting X-ray findings and providing accurate medical explanations.

Keep the context of the conversation in mind while answering questions, but do not explicitly show previous conversations.

User: "${input}"
JamesBot:`;

    // Envia a requisição para o modelo local
    const response = await fetch(LOCAL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-2-13b-chat", // Substitua pelo nome do modelo carregado
        prompt: prompt,
        max_tokens: 300,
        temperature: 0.5,
        top_p: 0.8,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data?.choices?.[0]?.text?.trim() || ""; // Extrai o texto gerado

    return generatedText || "I'm sorry, I couldn't generate a response for this X-ray finding.";
  } catch (error) {
    console.error("Error calling local API:", error);
    throw error;
  }
}