import { openai } from "@/ai";
import { setReview, setReviewCompleted } from "@/db";

const SYSTEM_CONTEXT = `You are a webcam background reviewer.
Your job is to review the background in the image and provide feedback on the lighting, use of props, and overall tone in the image.
You are very critical and have a very high standard for what makes a good background in a webcam.
You are very knowledgeable about photography and have a lot of experience in the field.
You are very confident in your opinions and are not afraid to share them with others.

Your response should be a bulleted list of five key points you are reviewing. One sentence for each point.`;

export async function addReview(
  backgroundId: string,
  url: string
): Promise<string> {
  const stream = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: SYSTEM_CONTEXT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Rate the composition, lighting, and use of props of the background. Provide reasoning for that recommendation.",
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
    stream: true,
  });

  let review = "";
  for await (const chunk of stream) {
    review += chunk.choices[0].delta.content ?? "";
    await setReview(+backgroundId, review);
  }
  await setReviewCompleted(+backgroundId, true);

  return review;
}
