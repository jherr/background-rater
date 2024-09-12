import { NextResponse } from "next/server";

import { getBackground } from "@/db";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(
  req: Request,
  {
    params: { id },
  }: {
    params: { id: string };
  }
) {
  const background = await getBackground(+id);
  return NextResponse.json(background);
}
