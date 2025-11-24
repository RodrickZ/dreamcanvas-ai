import { GoogleGenAI } from "@google/genai";
import { AspectRatio, GeneratedImage } from "../types";

const apiKey = process.env.API_KEY;

// Initialize the client once
// Note: In a real production app, you might want to handle key rotation or validation
const ai = new GoogleGenAI({ apiKey: apiKey });

/**
 * Generates an image based on the text prompt and configuration.
 */
export const generateImageFromText = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<GeneratedImage> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    let imageUrl = '';
    
    // Iterate through parts to find the image data
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                const base64EncodeString = part.inlineData.data;
                imageUrl = `data:image/png;base64,${base64EncodeString}`;
                break; // Found the image, stop searching
            }
        }
    }

    if (!imageUrl) {
        // Fallback or error if no image data found but call was successful
        throw new Error("No image data received from Gemini.");
    }

    return {
      id: crypto.randomUUID(),
      url: imageUrl,
      prompt: prompt,
      aspectRatio: aspectRatio,
      timestamp: Date.now(),
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};
