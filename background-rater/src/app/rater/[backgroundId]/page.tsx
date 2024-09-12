import { getBackground } from "@/db";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import BackgroundMonitor from "./BackgroundMonitor";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Camera({
  params: { backgroundId },
}: {
  params: { backgroundId: string };
}) {
  const background = await getBackground(+backgroundId);

  if (!background) {
    return <div>Background not found</div>;
  }

  return (
    <main>
      <div className="mb-5">
        <Link href="/">
          <Button>Try Another Background</Button>
        </Link>
      </div>
      <BackgroundMonitor backgroundId={backgroundId} background={background} />
    </main>
  );
}
