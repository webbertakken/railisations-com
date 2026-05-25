import type { Metadata } from "next";
import { LegalLayout } from "@/components/legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Railisations",
  description: "Plain-language terms for reading and using the Railisations site.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="May 2026">
      <p>
        Reading Railisations is free. Here are the simple rules for using the site.
      </p>

      <h2>Read freely</h2>
      <p>
        You can read everything published here without paying, signing up, or installing
        anything.
      </p>

      <h2>As-is</h2>
      <p>
        The site is provided as it is. We try to keep it accurate and useful, but make no
        promises about completeness or fitness for any particular purpose. Use your own
        judgement.
      </p>

      <h2>Be kind to the site</h2>
      <p>
        Please don&apos;t attempt to interfere with the site, scrape it aggressively, or
        harm other readers. If something looks broken, tell us instead of exploiting it.
      </p>

      <h2>Brand and content</h2>
      <p>
        The wordmark, the brass gear, and the writing belong to us. You&apos;re welcome to
        quote short excerpts and link back. For longer use, please ask first.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms over time. Any substantive change gets a fresh
        &ldquo;Last updated&rdquo; date at the top of the page.
      </p>

      <h2>Contact</h2>
      <p>
        Anything unclear? Write to{" "}
        <a href="mailto:hello@railisations.com">hello@railisations.com</a>.
      </p>
    </LegalLayout>
  );
}
