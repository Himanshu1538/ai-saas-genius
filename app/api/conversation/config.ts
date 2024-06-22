import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey);

const model: any = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a text-based AI generative model, trained to be an advanced conversational partner. I can process information and generate text in response to your prompts, questions, and requests.",
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
