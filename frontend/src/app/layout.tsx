import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Agentation } from "agentation";
import { GridOverlay } from "@/components/GridOverlay";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Computer Modern (CMU Serif). Self-hosted from the OFL-licensed package
// rather than its bundled CSS, which declares `font-style: roman` — not a
// valid CSS value.
const computerModern = localFont({
  src: "../../node_modules/computer-modern/fonts/cmu-serif-500-roman.woff2",
  variable: "--font-computer-modern",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agentic Feed",
  description: "An autonomous feed engine for sites without RSS.",
};

const isDev = process.env.NODE_ENV === "development";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${computerModern.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {isDev && <GridOverlay />}
        {isDev && <Agentation />}
      </body>
    </html>
  );
}
