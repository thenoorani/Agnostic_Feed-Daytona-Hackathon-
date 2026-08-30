# 01 - Architecture

## System Components

1. **Frontend (UI)**
   - A minimalist web application for users to submit URLs and view their feed.
   - Built with Next.js and TailwindCSS.

2. **Backend API (Control Plane)**
   - Manages the orchestration of the platform.
   - Built with Node.js/Express or Python/FastAPI.
   - **Responsibilities:**
     - Receive URL submissions.
     - Store site configurations and scrape history in a database.
     - Interface with the LLM API (e.g., OpenAI, Anthropic, Gemini) to generate scraper code.
     - Trigger Daytona to spin up execution sandboxes.
     - Push extracted content to Are.Na.

3. **LLM Engine (Code Generator)**
   - Takes a URL and (optionally) the site's initial DOM structure.
   - Outputs a standalone script (Python using Playwright/BeautifulSoup or Node.js using Puppeteer) designed to extract:
     - Title
     - Subtitle
     - Full-page or targeted Screenshot

4. **Daytona (Execution Environment)**
   - The secure runtime infrastructure.
   - **Responsibilities:**
     - Provision isolated, ephemeral containers (sandboxes).
     - Run the LLM-generated script.
     - Return the extracted JSON data and screenshot image back to the backend.

5. **Are.Na (Delivery Destination)**
   - Acts as the final chronological feed.
   - The backend uses the Are.Na API to create new blocks (images with text/links) whenever new content is detected.

## Data Flow (The "Add Site" Workflow)
1. User submits `https://example.com` via the Frontend.
2. Backend creates a new `Site` record in the database.
3. Backend fetches the raw HTML of the URL and passes it to the LLM Engine.
4. LLM Engine generates a custom `scrape.py` script.
5. Backend calls the Daytona API to create a sandbox.
6. Backend uploads `scrape.py` to the Daytona sandbox and executes it.
7. `scrape.py` returns `{ title, subtitle, screenshot_url/base64 }`.
8. Backend saves the extraction. Since it's the first run, it pushes the block to Are.Na.
9. Backend tears down the Daytona sandbox.

## Data Flow (The "Cron" Workflow)
1. Every X hours, the Backend queries all active `Site` records.
2. For each site, it sends the previously generated `scrape.py` to a new Daytona sandbox.
3. The script executes and returns the latest `{ title, subtitle, screenshot }`.
4. Backend compares the new output hash against the last known hash.
5. If different, the new content is pushed to Are.Na.
6. If the script fails (e.g., site layout changed), the Backend triggers the LLM Engine to regenerate the script (Self-Healing).
