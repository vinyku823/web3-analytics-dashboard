import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getAIInsight(topic: string, data: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are an expert Web3 analyst. Analyze the following data for "${topic}" and provide key insights, growth predictions, and potential risks. 
      Data: ${JSON.stringify(data)}
      Format the response in professional markdown.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Failed to generate AI insights at this time.";
  }
}

export async function askChainChat(question: string, history: any[]) {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are the Web3 Analytics assistant. Answer questions about blockchain, tokens, NFTs, and ecosystem growth based on real-time trends.",
      },
    });

    // Simple history mapping
    const response = await chat.sendMessage({ message: question });
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble processing that question right now.";
  }
}
