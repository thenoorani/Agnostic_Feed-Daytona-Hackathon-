"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { feedDays } from "@/lib/feed";

const LABEL_COLUMN_SPAN = 4; // columns 1-4, right-aligned against column 4
const TRACK_COLUMN_START = 1; // the row scrolls as one, description included
const TRACK_COLUMN_SPAN = 12
const ROW_SPAN = 3;

/**
 * Sets the opening phrase apart from the rest of a description: whatever
 * runs up to the first comma or colon. Returns an empty lead if the text
 * has no such break near the start, so the paragraph just renders plain.
 */
function splitLead(description: string): [string, string] {
  const match = description.match(/^([^,:]{1,60})[,:]/);
  if (!match) return ["", description];
  return [match[1], description.slice(match[1].length)];
}

function renderDescription(description: string) {
  const [lead, rest] = splitLead(description);
  if (!lead) return description;
  return (
    <>
      <strong className="feed-description__lead">{lead}</strong>
      {rest}
    </>
  );
}

/**
 * One track per day, spanning the full content width. Closed, it shows
 * the description and the day block. Open, the day's entries slide out
 * from behind the block and the whole row — description and block
 * included — scrolls horizontally, ending with the last entry on the
 * grid's right margin. Only the date label sits outside the track, so it
 * stays put however far the row is scrolled.
 */
export function Feed() {
  const [openDayId, setOpenDayId] = useState<string | null>(null);
  const tracks = useRef(new Map<string, HTMLDivElement | null>());

  const toggle = useCallback((dayId: string) => {
    setOpenDayId((current) => {
      // Rewind whichever track is being closed, so reopening it starts
      // from the first entry rather than wherever it was left.
      const closing = current === dayId ? dayId : current;
      if (closing) {
        const track = tracks.current.get(closing);
        if (track) track.scrollLeft = 0;
      }
      return current === dayId ? null : dayId;
    });
  }, []);

  // Trackpad scrolling for the open row: a two-finger gesture moves it
  // horizontally without any click or drag. Vertical delta is mapped to
  // horizontal travel, but only while the row still has room to move —
  // at either end the gesture falls through to the page, so the row
  // never traps the scroll. Attached natively because React's onWheel is
  // passive and so cannot preventDefault.
  useEffect(() => {
    if (!openDayId) return;
    const track = tracks.current.get(openDayId);
    if (!track) return;

    const onWheel = (event: WheelEvent) => {
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (delta === 0) return;

      const max = track.scrollWidth - track.clientWidth;
      const hasRoom = delta < 0 ? track.scrollLeft > 0 : track.scrollLeft < max;
      if (!hasRoom) return;

      event.preventDefault();
      track.scrollLeft = Math.max(0, Math.min(max, track.scrollLeft + delta));
    };

    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, [openDayId]);

  return (
    <>
      {feedDays.map((day, index) => {
        const isOpen = day.id === openDayId;
        const row = `${index * ROW_SPAN + 1} / span ${ROW_SPAN}`;

        return (
          <Fragment key={day.id}>
            <p
              className="feed-label"
              style={{ gridColumn: `1 / span ${LABEL_COLUMN_SPAN}`, gridRow: row }}
            >
              <span className="feed-label__date">{day.date},</span>{" "}
              <span className="feed-label__weekday">{day.weekday}</span>
            </p>

            <div
              className="feed-track"
              data-open={isOpen}
              ref={(node) => {
                tracks.current.set(day.id, node);
              }}
              style={{
                gridColumn: `${TRACK_COLUMN_START} / span ${TRACK_COLUMN_SPAN}`,
                gridRow: row,
              }}
            >
              <p className="feed-description">{renderDescription(day.description)}</p>

              <button
                type="button"
                className="feed-day"
                aria-expanded={isOpen}
                aria-label={`${day.date}, ${day.weekday} — ${day.entries.length} updates`}
                onClick={() => toggle(day.id)}
              />

              <div className="feed-entries" inert={!isOpen}>
                {day.entries.map((entry) => (
                  <a
                    key={entry.id}
                    className="feed-entry"
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className="sr-only">{entry.title}</span>
                    <span className="feed-entry__summary">{entry.summary}</span>
                  </a>
                ))}
              </div>
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
