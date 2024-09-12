import { redirect } from "next/navigation";

import { put } from "@vercel/blob";
import { addBackground } from "@/db";
import { inngest } from "@/inngest/client";

import { Camera } from "@/components/camera";

export default function Home() {
  async function onUploadImage(formData: FormData) {
    "use server";
    const file = formData.get("image") as Blob;
    const buffer = await file.arrayBuffer();
    const data = Buffer.from(buffer);

    const randomFileName = Math.random().toString(36).substring(2);

    const { url } = await put(`images/${randomFileName}.jpg`, data, {
      access: "public",
    });

    const backgroundId = await addBackground(url);

    await inngest.send({
      name: "rater/image-uploaded",
      data: {
        backgroundId,
        url,
      },
    });

    redirect(`/rater/${backgroundId}`);
  }

  return (
    <main>
      <Camera onUploadImage={onUploadImage} />
    </main>
  );
}
