import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { genAI } from "@/config/geminiconfig";


// Create the image model instance
const imageModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const useGenerateImage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate an image from a prompt
   */
  const generateImage = async (prompt: string) => {
    if (!prompt.trim()) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await imageModel.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        responseModalities: ["IMAGE"], // ✅ crucial for image output
      } as any);

      // Extract base64 image data safely
      const imageData =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!imageData) throw new Error("No image data found in Gemini response.");

      // Return as data URI for <Image source={{ uri }} />
      return `data:image/png;base64,${imageData}`;
    } catch (err: any) {
      console.error("Gemini Image Generation Error:", err);
      setError(err.message || "Failed to generate image.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generateImage, loading, error };
};
