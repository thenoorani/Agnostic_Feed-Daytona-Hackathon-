import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Agentation } from "agentation";
import "./globals.css";
import type { ReactNode } from "react";

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
  src: [
    {
      path: "../../node_modules/computer-modern/fonts/cmu-serif-500-roman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      // The real bold cut, so the lead-in is not synthesised.
      path: "../../node_modules/computer-modern/fonts/cmu-serif-700-roman.woff2",
      weight: "700",
      style: "normal",
    },
    {
      // Real italics too — the browser would otherwise slant the roman.
      path: "../../node_modules/computer-modern/fonts/cmu-serif-500-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../node_modules/computer-modern/fonts/cmu-serif-700-italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-computer-modern",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agentic Feed",
  description: "An autonomous feed engine for sites without RSS.",
};

const isDev = process.env.NODE_ENV === "development";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${computerModern.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {isDev && <Agentation />}
      </body>
    </html>
  );
}
