import restData from './data.json';
import updateData from './update_data.json';

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

export type FollowedSite = {
  name: string;
  host: string;
  url: string;
};

class FeedStore {
  private days: FeedDay[] = restData as FeedDay[];
  private listeners = new Set<() => void>();

  getDays() {
    return this.days;
  }

  getFollowedSites(): FollowedSite[] {
    const seen = new Map<string, FollowedSite>();
    for (const day of this.days) {
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
  }

  triggerUpdate() {
    if (this.days === restData) {
      this.days = updateData as FeedDay[];
    } else {
      this.days = restData as FeedDay[];
    }
    this.emit();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}

export const feedStore = new FeedStore();
// Keep the old exports for compatibility if needed, but we should update components to use the store.
export const feedDays: FeedDay[] = restData as FeedDay[];
export const followedSites: FollowedSite[] = feedStore.getFollowedSites();
