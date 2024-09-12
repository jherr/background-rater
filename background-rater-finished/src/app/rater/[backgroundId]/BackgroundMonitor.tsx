"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Markdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";

import { Background } from "@/db";

export default function BackgroundMonitor({
  backgroundId,
  background: initialBackground,
}: {
  backgroundId: string;
  background: Background;
}) {
  const [enabled, setEnabled] = useState(true);
  const { data } = useQuery<Background>({
    queryKey: ["background", backgroundId],
    queryFn: async () => {
      const response = await fetch(`/api/background/${backgroundId}`);
      return response.json();
    },
    initialData: initialBackground,
    refetchInterval: 200,
    enabled,
  });

  useEffect(() => {
    setEnabled(
      !data?.review_completed || !data?.theme || !data?.new_background
    );
  }, [data?.review_completed, data?.theme, data?.new_background]);

  return (
    <div className="flex gap-4">
      <div className="w-1/2">
        <h2 className="text-xl font-semibold">What You&apos;ve Got</h2>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={data?.image}
            alt="Background"
            width={1920}
            height={1080}
          />
        </div>
        <Markdown className="mt-4">{data?.review}</Markdown>
      </div>
      <div className="w-1/2">
        <h2 className="text-xl font-semibold">What You Need</h2>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          {data?.new_background ? (
            <Image
              src={data?.new_background}
              alt="Background"
              width={1920}
              height={1080}
              className="w-full"
            />
          ) : (
            <Skeleton className="w-full aspect-video rounded-lg" />
          )}
        </div>
        <Markdown className="mt-4">{data?.theme}</Markdown>
      </div>
    </div>
  );
}
