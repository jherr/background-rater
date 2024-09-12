import { openai } from "@/ai";

export async function generateImage(theme: string): Promise<string> {
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: `A webcam background image with this theme: ${theme}`,
    size: "1792x1024",
    quality: "standard",
    n: 1,
  });

  return response?.data[0].url ?? "";
}
