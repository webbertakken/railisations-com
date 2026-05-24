import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Timeline } from "@/components/timeline";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="top" className="flex w-full flex-grow flex-col">
        <Timeline />
      </main>
      <SiteFooter />
    </>
  );
}
