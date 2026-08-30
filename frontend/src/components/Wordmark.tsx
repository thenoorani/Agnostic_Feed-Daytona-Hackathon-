"use client";

import { useEffect, useState } from "react";

const TEXT = "Agnostic";
const STEP_MS = 75;

/**
 * Types the wordmark out on load, one character every 30ms. The full
 * word is always in the DOM — once hidden for width so the letters
 * appear left to right rather than growing out from the centre, and
 * once for screen readers.
 */
export function Wordmark() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(TEXT.length);
      return;
    }

    const id = window.setInterval(() => {
      setCount((current) => {
        if (current >= TEXT.length) {
          window.clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <h1 className="wordmark">
      <span className="wordmark__inner">
        <span className="wordmark__measure" aria-hidden>
          {TEXT}
        </span>
        <span className="wordmark__typed" aria-hidden>
          {TEXT.slice(0, count)}
        </span>
      </span>
      <span className="sr-only">{TEXT}</span>
    </h1>
  );
}
