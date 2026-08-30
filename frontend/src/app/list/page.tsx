import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { followedSites } from "@/lib/feed";

export const metadata: Metadata = {
  title: "Your List — Agnostic",
};

export default function ListPage() {
  return (
    <main className="page panel flex-1">
      <Header />

      <ul className="panel__list">
        {followedSites.map((site) => (
          <li key={site.host}>
            <a
              className="panel__item"
              href={site.url}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span className="panel__name">{site.name}</span>
              <span className="panel__host">{site.host}</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
