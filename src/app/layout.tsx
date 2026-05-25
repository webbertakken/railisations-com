import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import { WebVitals } from "@/components/web-vitals";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Railisations - 20 lessons",
  description:
    "Railisations: a chronologically arranged collection of twenty lessons, rendered as a luminous copper timeline on a deep charcoal canvas.",
  applicationName: "Railisations",
  openGraph: {
    title: "Railisations - 20 lessons",
    description:
      "Twenty lessons in a luminous copper timeline, presented for late-night reading.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#131313",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-background text-on-surface font-body-md text-body-md flex min-h-screen flex-col antialiased">
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
