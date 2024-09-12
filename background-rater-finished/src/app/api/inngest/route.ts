import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { getReaction } from "@/inngest/functions/getReaction";
import { makeNewBackground } from "@/inngest/functions/makeNewBackground";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [getReaction, makeNewBackground],
});
