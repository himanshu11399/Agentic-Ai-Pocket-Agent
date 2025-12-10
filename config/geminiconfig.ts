import { GoogleGenerativeAI } from "@google/generative-ai";

export const genAI=new GoogleGenerativeAI(
    process.env.EXPO_PUBLIC_GEMINI_API_KEY!
);

export const MODEL_NAME="gemini-2.5-flash"