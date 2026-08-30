"use client";

import { useState } from "react";
import { followedSites } from "@/lib/feed";

type Panel = "list" | "about";

/**
 * The two top-right buttons and the sheets they open. Only one sheet is
 * open at a time; the active button becomes the way back, while the
 * other switches straight across.
 */
export function TopPanels() {
  const [open, setOpen] = useState<Panel | null>(null);
  const toggle = (panel: Panel) =>
    setOpen((current) => (current === panel ? null : panel));

  return (
    <>
      <nav className="top-nav">
        <button
          type="button"
          className="top-nav__button"
          aria-expanded={open === "list"}
          onClick={() => toggle("list")}
        >
          {open === "list" ? "Back to Feed" : "Your List"}
        </button>

        <button
          type="button"
          className="top-nav__button"
          aria-expanded={open === "about"}
          onClick={() => toggle("about")}
        >
          {open === "about" ? "Back to Feed" : "About"}
        </button>
      </nav>

      <div className="sheet" data-open={open === "list"} inert={open !== "list"}>
        <ul className="sheet__list">
          {followedSites.map((site) => (
            <li key={site.host}>
              <a
                className="sheet__item"
                href={site.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="sheet__name">{site.name}</span>
                <span className="sheet__host">{site.host}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="sheet" data-open={open === "about"} inert={open !== "about"}>
        <div className="sheet__about">
          <p>
            Agnostic turns any website into a chronological feed. It follows the
            blogs, studios and company pages that never got round to publishing
            an RSS feed.
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
      </div>
    </>
  );
}
