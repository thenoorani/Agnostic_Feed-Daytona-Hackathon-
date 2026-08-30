"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** A period expands into four marks, then rises into two leaning
 *  strokes with a period and a comma. Playback is SMIL, so it runs from
 *  first paint without waiting for hydration. */
const PERIOD = "M -5,0 L -5,-10 L 5,-10 L 5,0 Z";
const LEFT_LEG = "M -5,0 L 12,-42 L 22,-42 L 5,0 Z";
const RIGHT_LEG = "M -5,0 L -22,-42 L -12,-42 L 5,0 Z";
const COMMA_CLOSED =
  "M -5,-10 L 5,-10 L 5,0 C 5,0 5,0 5,0 L 5,0 C 5,0 5,0 5,0 L -5,0 Z";
const COMMA_OPEN =
  "M -5,-10 L 5,-10 L 5,-0.5 C 5,3.5 3.4,7.2 0.6,10.2 L -0.9,8.9 C 0.9,6.4 1.4,3.2 0.4,0 L -5,0 Z";

const DURATION = "2.8s";
const SHAPE_KEY_TIMES = "0;0.214;0.5;0.571;0.857;1";
const SHAPE_SPLINES = "0 0 1 1;0 0 1 1;0 0 1 1;.45 0 .2 1;0 0 1 1";
const MOVE_KEY_TIMES = "0;0.214;0.5;1";
const MOVE_SPLINES = "0 0 1 1;.2 .8 .2 1;0 0 1 1";

const shape = (from: string, to: string) => [from, from, from, from, to, to].join(";");
const move = (x: number) => `0 0; 0 0; ${x} 0; ${x} 0`;

/** viewBox height, and the opened panel's geometry in user units. REACH
 *  mirrors --mark-reach in globals.css; the other two derive from it the
 *  same way the CSS custom properties do. */
const VIEW_BOX_HEIGHT = 62.5;
const REACH = 560;
const FIELD_EXTENT = REACH + 10;
const OPEN_EXTENT = REACH + 76;
/** Wait this long after typing before growing further. */
const REFLOW_DELAY = 300;

export function PunctuationMark() {
  const [swallowing, setSwallowing] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const limitRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | null>(null);
  const swallowTimer = useRef<number | null>(null);

  const replay = useCallback(() => {
    svgRef.current?.setCurrentTime(0);
  }, []);

  /** Grow the panel to fit the typed URL, up to column 5's right edge. */
  const fitToValue = useCallback(() => {
    const form = formRef.current;
    const input = inputRef.current;
    const limit = limitRef.current;
    if (!form || !input || !limit) return;

    const unit = form.getBoundingClientRect().height / VIEW_BOX_HEIGHT;
    if (!unit) return;

    const styles = getComputedStyle(input);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;
    context.font = `${styles.fontSize} ${styles.fontFamily}`;

    // How much wider than the resting field the text needs, in units.
    // The field's padding is not usable text width, so count it in —
    // otherwise the text is clipped well before the panel starts to grow.
    const padding =
      parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const needed = context.measureText(input.value).width + padding + 6;
    const overflow = Math.max(0, needed / unit - FIELD_EXTENT);

    // The cap comes from CSS, so the grid maths stays in one place.
    const maxExtent = limit.getBoundingClientRect().width / unit;
    const room = Math.max(0, maxExtent - OPEN_EXTENT);

    form.style.setProperty("--mark-extra", String(Math.min(overflow, room)));
  }, []);

  const onInput = useCallback(() => {
    setHasValue((inputRef.current?.value.length ?? 0) > 0);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(fitToValue, REFLOW_DELAY);
  }, [fitToValue]);

  const clear = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    input.value = "";
    setHasValue(false);
    formRef.current?.style.setProperty("--mark-extra", "0");
    // Back to the field, so the panel stays open and you can keep typing.
    input.focus();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Show the resolved mark rather than animating into it.
      svg.setCurrentTime(2.8);
      svg.pauseAnimations();
    }

    // The cap moves with the viewport, so re-fit when it changes.
    const onResize = () => fitToValue();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timer.current !== null) window.clearTimeout(timer.current);
      if (swallowTimer.current !== null) window.clearTimeout(swallowTimer.current);
    };
  }, [fitToValue]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // No ingestion endpoint yet — the backend owns this. Until then an
    // accepted URL just clears the field and plays the swallow.
    const input = inputRef.current;
    if (!input || !input.value.trim() || !input.checkValidity()) return;

    input.value = "";
    setHasValue(false);
    formRef.current?.style.setProperty("--mark-extra", "0");
    input.blur();

    setSwallowing(true);
    if (swallowTimer.current !== null) window.clearTimeout(swallowTimer.current);
    swallowTimer.current = window.setTimeout(() => setSwallowing(false), 1150);
  };

  return (
    <form
      ref={formRef}
      className={swallowing ? "mark-form is-swallowing" : "mark-form"}
      onSubmit={onSubmit}
    >
      <svg
        ref={svgRef}
        className="mark"
        viewBox="-33 -47 81 62.5"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="A period expands into four marks, then rises into two leaning strokes with a period and a comma."
        onClick={replay}
      >
        {/* period -> forward-leaning stroke (left leg) */}
        <path d={PERIOD}>
          <animate
            attributeName="d"
            dur={DURATION}
            fill="freeze"
            keyTimes={SHAPE_KEY_TIMES}
            calcMode="spline"
            keySplines={SHAPE_SPLINES}
            values={shape(PERIOD, LEFT_LEG)}
          />
          <animateTransform
            attributeName="transform"
            type="translate"
            dur={DURATION}
            fill="freeze"
            keyTimes={MOVE_KEY_TIMES}
            calcMode="spline"
            keySplines={MOVE_SPLINES}
            values={move(-23)}
          />
        </path>

        {/* period -> the rule. Two nested groups so the stretch and the
            thinning can run on separate timings. */}
        <g className="mark__rule-x">
          <g className="mark__rule-y">
            <path d={PERIOD} />
          </g>
        </g>

        <g className="mark__tail">
          {/* period -> backward-leaning stroke (right leg) */}
          <path d={PERIOD}>
            <animate
              attributeName="d"
              dur={DURATION}
              fill="freeze"
              keyTimes={SHAPE_KEY_TIMES}
              calcMode="spline"
              keySplines={SHAPE_SPLINES}
              values={shape(PERIOD, RIGHT_LEG)}
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              dur={DURATION}
              fill="freeze"
              keyTimes={MOVE_KEY_TIMES}
              calcMode="spline"
              keySplines={MOVE_SPLINES}
              values={move(23)}
            />
          </path>

          {/* period -> comma */}
          <path d={COMMA_CLOSED}>
            <animate
              attributeName="d"
              dur={DURATION}
              fill="freeze"
              keyTimes={SHAPE_KEY_TIMES}
              calcMode="spline"
              keySplines={SHAPE_SPLINES}
              values={shape(COMMA_CLOSED, COMMA_OPEN)}
            />
            <animateTransform
              attributeName="transform"
              type="translate"
              dur={DURATION}
              fill="freeze"
              keyTimes={MOVE_KEY_TIMES}
              calcMode="spline"
              keySplines={MOVE_SPLINES}
              values={move(38)}
            />
          </path>
        </g>
      </svg>

      <input
        ref={inputRef}
        className="mark-form__input"
        type="url"
        name="url"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        placeholder="Enter a URL to follow"
        aria-label="Enter a URL to follow"
        onInput={onInput}
      />

      {hasValue && (
        <button
          type="button"
          className="mark-form__clear"
          aria-label="Clear the URL"
          onClick={clear}
        >
          <span aria-hidden>&times;</span>
        </button>
      )}

      {/* Measures column 5's right edge, so the cap is defined in CSS
          alongside the rest of the grid rather than recomputed here. */}
      <span ref={limitRef} className="mark-form__limit" aria-hidden />
    </form>
  );
}
