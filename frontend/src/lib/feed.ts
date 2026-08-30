import feedData from './data.json';

export type FeedEntry = {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  summary: string;
};

export type FeedDay = {
  id: string;
  date: string;
  weekday: string;
  description: string;
  entries: FeedEntry[];
};

export const feedDays: FeedDay[] = feedData as FeedDay[];

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
      let host = "example.com";
      try {
        host = new URL(entry.url).hostname.replace(/^www\./, "");
      } catch (e) {
        host = entry.title.split(" — ")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + ".com";
      }
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
