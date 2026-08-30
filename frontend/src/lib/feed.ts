export type FeedEntry = {
  id: string;
  title: string;
  url: string;
  /** Shown in the dropdown that slides out on hover. */
  summary: string;
};

export type FeedDay = {
  id: string;
  /** e.g. "30th of August" — shown first, in 50% grey. */
  date: string;
  /** e.g. "Sunday". */
  weekday: string;
  /** One-paragraph summary of the day's haul, written by the model. */
  description: string;
  entries: FeedEntry[];
};

/**
 * Placeholder for what the ingestion agent will return: one group per
 * day, holding the three or four items scraped for it plus generated
 * summaries. Replace with the API response once the backend lands — the
 * shape is what the UI reads.
 */
export const feedDays: FeedDay[] = [
  {
    id: "2026-08-30",
    date: "30th of August",
    weekday: "Sunday",
    description:
      "Four studio updates, weighted toward identity work: new work from Pentagram, a COLLINS case study on brand systems, a project release from Base Design, and a journal entry from Instrument.",
    entries: [
      {
        id: "a1",
        title: "Pentagram — new work",
        url: "https://www.pentagram.com/",
        summary:
          "A new visual identity for a cultural institution, including wordmark and signage.",
      },
      {
        id: "a2",
        title: "COLLINS — case study",
        url: "https://www.collins.com/",
        summary:
          "How a consumer brand system was rebuilt around motion and colour.",
      },
      {
        id: "a3",
        title: "Base Design — project",
        url: "https://basedesign.com/",
        summary:
          "Editorial design for an annual report, printed in two inks.",
      },
      {
        id: "a4",
        title: "Instrument — journal",
        url: "https://www.instrument.com/",
        summary:
          "A short essay on designing for long-lived digital products.",
      },
    ],
  },
  {
    id: "2026-08-29",
    date: "29th of August",
    weekday: "Saturday",
    description:
      "A quieter day, mostly writing: a Wolff Olins thinking piece, engineering notes from AREA 17, and a typography release from Hoefler&Co.",
    entries: [
      {
        id: "b1",
        title: "Wolff Olins — thinking",
        url: "https://www.wolffolins.com/",
        summary:
          "An argument for brands built to change rather than to endure.",
      },
      {
        id: "b2",
        title: "AREA 17 — notes",
        url: "https://area17.com/",
        summary:
          "Engineering notes on caching strategy for large editorial sites.",
      },
      {
        id: "b3",
        title: "Hoefler&Co — typography",
        url: "https://www.typography.com/",
        summary:
          "A text family released in eight weights with optical sizes.",
      },
    ],
  },
  {
    id: "2026-08-28",
    date: "28th of August",
    weekday: "Friday",
    description:
      "Motion-heavy: a studio update from DIA, a new film from Buck, a product feature on Readymag, and a partner appointment announced by Pentagram.",
    entries: [
      {
        id: "c1",
        title: "DIA — studio update",
        url: "https://dia.tv/",
        summary:
          "The studio's recent motion work, collected into a single reel.",
      },
      {
        id: "c2",
        title: "Buck — new film",
        url: "https://buck.co/",
        summary:
          "A short animated film made for a technology client's launch.",
      },
      {
        id: "c3",
        title: "Readymag — feature",
        url: "https://readymag.com/",
        summary:
          "A new layout feature aimed at editorial and portfolio sites.",
      },
      {
        id: "c4",
        title: "Pentagram — appointment",
        url: "https://www.pentagram.com/",
        summary:
          "A new partner joins the London office, working in brand and print.",
      },
    ],
  },
  {
    id: "2026-08-27",
    date: "27th of August",
    weekday: "Thursday",
    description:
      "Nothing new: none of the followed sites published anything today.",
    entries: [],
  },
  {
    id: "2026-08-26",
    date: "26th of August",
    weekday: "Wednesday",
    description:
      "Technical and motion work side by side: an AREA 17 engineering post, a Wolff Olins report, a DIA motion study, and behind-the-scenes footage from Buck.",
    entries: [
      {
        id: "e1",
        title: "AREA 17 — engineering post",
        url: "https://area17.com/",
        summary:
          "On incremental static regeneration, and when it is worth the complexity.",
      },
      {
        id: "e2",
        title: "Wolff Olins — report",
        url: "https://www.wolffolins.com/",
        summary:
          "A research report on how younger audiences read brand signals.",
      },
      {
        id: "e3",
        title: "DIA — motion study",
        url: "https://dia.tv/",
        summary:
          "A typographic motion study exploring weight and rhythm.",
      },
      {
        id: "e4",
        title: "Buck — behind the scenes",
        url: "https://buck.co/",
        summary:
          "Process footage showing how a recent spot was storyboarded and lit.",
      },
    ],
  },
  {
    id: "2026-08-25",
    date: "25th of August",
    weekday: "Tuesday",
    description:
      "Three releases: new templates on Readymag, a type release from Hoefler&Co, and an exhibition announced by Pentagram.",
    entries: [
      {
        id: "f1",
        title: "Readymag — templates",
        url: "https://readymag.com/",
        summary:
          "Six new templates aimed at photographers and small studios.",
      },
      {
        id: "f2",
        title: "Hoefler&Co — release",
        url: "https://www.typography.com/",
        summary:
          "A display cut released alongside the existing text family.",
      },
      {
        id: "f3",
        title: "Pentagram — exhibition",
        url: "https://www.pentagram.com/",
        summary:
          "An exhibition of the studio's poster work, opening next month.",
      },
    ],
  },
  {
    id: "2026-08-24",
    date: "24th of August",
    weekday: "Monday",
    description:
      "A reading-heavy start to the week: an essay from COLLINS, product work by Instrument, a Base Design signage system, and a client launch from AREA 17.",
    entries: [
      {
        id: "g1",
        title: "COLLINS — essay",
        url: "https://www.collins.com/",
        summary:
          "An essay on why brand strategy documents so rarely survive contact.",
      },
      {
        id: "g2",
        title: "Instrument — product work",
        url: "https://www.instrument.com/",
        summary:
          "Product design for a streaming service's discovery experience.",
      },
      {
        id: "g3",
        title: "Base Design — signage",
        url: "https://basedesign.com/",
        summary:
          "A wayfinding system for a transport hub, tested at full scale.",
      },
      {
        id: "g4",
        title: "AREA 17 — client launch",
        url: "https://area17.com/",
        summary:
          "A publishing platform launched for a long-running magazine.",
      },
    ],
  },
];

export type FollowedSite = {
  name: string;
  host: string;
  url: string;
};

/**
 * The sources being followed, derived from the feed rather than stored
 * separately, so there is one source of truth while the data is mocked.
 * The backend will serve this from the `sites` table instead.
 */
export const followedSites: FollowedSite[] = (() => {
  const seen = new Map<string, FollowedSite>();

  for (const day of feedDays) {
    for (const entry of day.entries) {
      const host = new URL(entry.url).hostname.replace(/^www\./, "");
      if (seen.has(host)) continue;
      seen.set(host, {
        name: entry.title.split(" — ")[0],
        host,
        url: `https://${host}/`,
      });
    }
  }

  return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
})();
