import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey: string = process.env.NEXT_PUBLIC_GEMINI_API_KEY ?? "";

// Initialize the Google Generative AI client with the API key
const genAI: GoogleGenerativeAI = new GoogleGenerativeAI(apiKey);

// Configure the generative AI model with specific instructions
const model: any = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    " You are a code generator. You must answer only in markdown code snippet. Use code comments for explanations.\nInstructions: The output format should be structured like this:\nInstruction Text\nMarkdown code snippet\nExplanation",
});

// Configuration for the AI generation parameters
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

// Function for chat session with the configured AI model
export const AiChatSession = model.startChat({
  generationConfig,
  history: [],
});
