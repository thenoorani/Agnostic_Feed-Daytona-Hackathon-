"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "agentic-feed:grid-overlay";
const COLUMNS = 12;

type Metrics = { width: number; topMargin: number; module: number };

/* Custom properties holding a calc() resolve lazily, so getPropertyValue
   hands back the unevaluated expression. Measure the rendered guides. */
function readMetrics(): Metrics {
  const margin = document.querySelector(".grid-overlay__margin--top");
  const column = document.querySelector(".grid-overlay__col");
  return {
    width: window.innerWidth,
    topMargin: Math.round(margin?.getBoundingClientRect().height ?? 0),
    module: Math.round(column?.getBoundingClientRect().width ?? 0),
  };
}

/**
 * Dev-only grid overlay: the proportional top margin, 12 vertical
 * columns, and square rows tiling down the page. Toggle with the G key
 * or the corner button; the choice is remembered in localStorage.
 */
export function GridOverlay() {
  const [visible, setVisible] = useState(true);
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const toggle = useCallback(() => {
    setVisible((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Private mode / blocked storage — the toggle still works for this page.
      }
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored !== null) setVisible(stored === "true");
    } catch {
      // Ignore — fall back to the default.
    }
  }, []);

  useEffect(() => {
    // A ResizeObserver rather than a one-shot read plus a resize
    // listener: a tab that is laid out at zero size (hidden pane,
    // background tab) would otherwise keep a zeroed readout until the
    // window itself resized. This re-measures the moment layout lands.
    const update = () => setMetrics(readMetrics());
    const observer = new ResizeObserver(update);
    observer.observe(document.documentElement);
    // ResizeObserver delivery rides the rendering loop, which stalls in a
    // backgrounded tab, so keep the plain resize event as a fallback.
    window.addEventListener("resize", update);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "g" && event.key !== "G") return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        (target && /^(input|textarea|select)$/i.test(target.tagName))
      ) {
        return;
      }

      toggle();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  return (
    <>
      <div aria-hidden className="grid-overlay" data-visible={visible}>
        <div className="grid-overlay__margin grid-overlay__margin--top" />
        <div className="grid-overlay__margin grid-overlay__margin--bottom" />
        <div className="grid-overlay__field">
          <div className="grid-overlay__rows" />
          <div className="grid-overlay__cols">
            {Array.from({ length: COLUMNS }, (_, index) => (
              <div key={index} className="grid-overlay__col" />
            ))}
          </div>
        </div>
      </div>

      <button type="button" className="grid-overlay__toggle" onClick={toggle}>
        {visible ? "grid on" : "grid off"}
        {metrics
          ? ` · ${metrics.width}px · top ${metrics.topMargin} · module ${metrics.module}`
          : ""}
      </button>
    </>
  );
}
