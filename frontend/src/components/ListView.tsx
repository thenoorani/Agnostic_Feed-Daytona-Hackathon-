"use client";

import { useState } from "react";
import { followedSites } from "@/lib/feed";

/**
 * The sites being followed. The button sits in the top margin at the
 * right edge of the grid; opening fades the feed out behind a white
 * sheet and reveals the list in the centre of the screen.
 */
export function ListView() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="list-toggle"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Back to Feed" : "See Your List"}
      </button>

      <div className="list-view" data-open={open} inert={!open}>
        <ul className="list-view__items">
          {followedSites.map((site) => (
            <li key={site.host}>
              <a
                className="list-view__item"
                href={site.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                <span className="list-view__name">{site.name}</span>
                <span className="list-view__host">{site.host}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
