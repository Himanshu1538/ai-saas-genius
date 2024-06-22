import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey);

const model: any = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a text summarizer. Summarize the following text in a concise and structured manner. Provide an overview of the main topic, identify the key points discussed, and highlight the most important takeaways. Ensure the summary is well-organized with distinct sections for the overview, key points, and takeaways. The heading should be bold. Points should be in bullet points.",
});

const generationConfig: {
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  responseMimeType: string;
} = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const AiChatSession = model.startChat({
  generationConfig,
  history: [],
});
