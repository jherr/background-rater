import { openai } from "@/ai";

export async function getTheme(url: string): Promise<string> {
  const out = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `What is the overall theme of the background in this webcam image? Provide the theme as a string that can be used to promp the AI to generate a prompt for a new replacement background image`,
          },
          {
            type: "image_url",
            image_url: {
              url,
            },
          },
        ],
      },
    ],
    max_tokens: 400,
  });

  return out?.choices[0].message.content ?? "";
}
