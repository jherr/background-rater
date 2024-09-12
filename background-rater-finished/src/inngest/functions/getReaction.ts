import { addReview } from "@/ai/review";
import { getTheme } from "@/ai/theme";

import { setTheme } from "@/db";

import { inngest } from "@/inngest/client";

export const getReaction = inngest.createFunction(
  { id: "getReaction" },
  { event: "rater/image-uploaded" },
  async ({ event, step }) => {
    const { url, backgroundId } = event.data;

    const reviewPromise = step.run("add-review", async () => {
      return await addReview(backgroundId, url);
    });

    const themePromise = step.run("get-theme", async () => {
      const theme = await getTheme(url);
      await setTheme(+backgroundId, theme);

      await inngest.send({
        name: "rater/theme-updated",
        data: {
          backgroundId,
          theme,
        },
      });

      return theme;
    });

    const [review, theme] = await Promise.all([reviewPromise, themePromise]);

    return {
      backgroundId,
      review,
      theme,
    };
  }
);
