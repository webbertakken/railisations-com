import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Privacy | Railisations",
  description: "Plain-language privacy statement for the Railisations reading site.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy" lastUpdated="May 2026">
      <p>
        Railisations is a static reading site. Here&apos;s what that means for your privacy,
        in plain words.
      </p>

      <h2>What we collect</h2>
      <p>
        Nothing about you. No accounts, no sign-ups, no cookies, no analytics, no
        advertising trackers, no fingerprinting.
      </p>

      <h2>Server logs</h2>
      <p>
        The site runs on Cloudflare. Cloudflare keeps short-lived access logs (your IP
        address, the URL you requested, the timestamp) to keep the site online and to stop
        abuse. We never look at them, and we never share or sell them.
      </p>

      <h2>Fonts, images, and embeds</h2>
      <p>
        Fonts are bundled with the page itself, not fetched from a third party. There are
        no embedded videos, social-media widgets, or pixels. Loading this page does not
        tell Google, Meta, or anyone else that you visited.
      </p>

      <h2>Changes</h2>
      <p>
        If this ever changes, the &ldquo;Last updated&rdquo; date at the top of this page
        will change with it.
      </p>

      <h2>Questions</h2>
      <p>
        Email{" "}
        <a href="mailto:hello@railisations.com">hello@railisations.com</a>{" "}
        and we&apos;ll answer in plain language too.
      </p>
    </LegalLayout>
  );
}
