import { SiteFooter } from "@/components/site-footer";
import { SiteShell } from "@/components/site-shell";
import { Timeline } from "@/components/timeline";

export default function HomePage() {
  return (
    <SiteShell>
      <main className="flex w-full flex-grow flex-col">
        <Timeline />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
