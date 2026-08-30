# 03 - Frontend

The frontend should be extremely simple, focusing on utility and aesthetic minimalism, matching the vibe of platforms like Are.Na.

## Tech Stack
*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS
*   **State Management:** React Hooks
*   **Data Fetching:** SWR or native `fetch`
*   **Deployment:** Vercel

## Pages & Views

### 1. Home / Input View (`/`)
The primary interface for users to add new URLs to their feed.
*   **UI Components:**
    *   Large, centered input field: "Enter a URL to follow..."
    *   Submit Button ("Follow")
*   **Interactions:**
    *   On submit, shows a loading state: "Agent is analyzing the site..."
    *   Once the backend generates the script and does the first successful Daytona run, it shows a success toast and displays a preview of what was captured (Title, Subtitle, Screenshot).

### 2. Managed Sites View (`/sites`)
A dashboard to see which websites are currently being tracked.
*   **UI Components:**
    *   List/Table of monitored URLs.
    *   Status indicator (e.g., "Active", "Script Broken", "Last Scraped: 10 mins ago").
    *   Option to manually trigger a scrape or delete the site.

### 3. The Feed View (`/feed`) - *Optional*
If you prefer to have a native feed in addition to (or instead of) Are.Na.
*   **UI Components:**
    *   A chronological timeline.
    *   Each card contains:
        *   The **Screenshot** (prominent, acts as the visual anchor).
        *   The **Title** (bold).
        *   The **Subtitle** (secondary text).
        *   Source domain name and timestamp.
        *   Link out to the original URL.

## Design Guidelines
*   **Monochrome / Brutalist:** Black and white with a single accent color (e.g., Are.Na blue or a neon green to signify "Agent active").
*   **Typography:** Sans-serif, highly legible (e.g., Inter, Helvetica Neue).
*   **Feedback:** Since generating a script and spinning up a Daytona sandbox might take 10-30 seconds, use engaging loading states (e.g., a terminal-like window showing the backend steps: "Booting sandbox...", "Generating Python script...", "Executing...").
