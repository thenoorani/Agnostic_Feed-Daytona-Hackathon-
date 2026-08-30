import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "About — Agnostic",
};

export default function AboutPage() {
  return (
    <main className="page panel flex-1">
      <Header />

      <div className="panel__prose">
        <p>
          Agnostic turns any website into a chronological feed. It follows the
          blogs, studios and company pages that never got round to publishing an
          RSS feed.
        </p>
        <p>
          Each morning an agent checks whether a site has changed, writes a
          scraper for it on the spot, and runs that scraper inside an isolated
          sandbox. Whatever it finds is filed here, by day.
        </p>
        <p>
          No feed to configure, and no scraper to maintain when a site is
          redesigned — the agent simply writes another one.
        </p>
      </div>
    </main>
  );
}
