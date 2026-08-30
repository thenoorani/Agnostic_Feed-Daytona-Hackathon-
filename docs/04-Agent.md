# 04 - The Agent

The "Agent" is the core intelligence of the platform. It handles dynamically writing code to parse unstructured websites and utilizes Daytona to run that code safely.

## Agent Workflow

### 1. Analysis Phase
When a URL is submitted, the backend fetches the raw HTML (or uses a headless browser to get the rendered DOM).
*   **Prompting the LLM:** The backend sends a prompt to an LLM (e.g., GPT-4o, Claude 3.5 Sonnet) containing:
    *   The URL.
    *   A snippet of the DOM.
    *   Strict instructions to output *only* executable Python code.

### 2. Code Generation (The Prompt)
The LLM is instructed to generate a script utilizing a specific stack, for example, Python with Playwright.

**Example LLM Prompt:**
```text
You are an expert web scraper. I need a Python Playwright script to extract the latest main update from the following URL: {{url}}.
Here is a sample of the DOM:
{{dom_snippet}}

Your script must:
1. Navigate to the URL.
2. Wait for the main content to load.
3. Extract the primary "Title" of the most recent post/update.
4. Extract the "Subtitle" or short summary.
5. Take a screenshot of the specific element containing this update, or the viewport.
6. Save the screenshot to `/tmp/screenshot.png`.
7. Print a JSON object to stdout containing EXACTLY these keys: {"title": "...", "subtitle": "...", "screenshot_path": "/tmp/screenshot.png"}.
Do not output any markdown formatting, ONLY the python code.
```

### 3. Execution in Daytona (The Sandbox)
You cannot run untrusted, LLM-generated code on your backend server. This is where Daytona is crucial.
1.  **Provision:** Backend calls Daytona API to spin up a pre-configured workspace (e.g., a devcontainer image that already has Python, Playwright, and Chromium installed).
2.  **Transfer:** The backend injects the generated `scrape.py` into the Daytona sandbox workspace.
3.  **Execute:** The backend runs the command `python scrape.py` inside the sandbox via Daytona's execution API.
4.  **Retrieve:**
    *   Capture the stdout (the JSON object).
    *   If the script succeeds, copy `/tmp/screenshot.png` out of the sandbox.
5.  **Teardown:** Destroy the sandbox to free resources.

### 4. Self-Healing
Websites change their layouts. When the cron job runs the script in Daytona a week later, it might fail (e.g., CSS selectors changed).
*   **Detection:** Daytona execution returns a non-zero exit code or fails to output valid JSON.
*   **Recovery:** The backend catches the error, fetches the new HTML, and prompts the LLM again: *"Your previous script failed with this error: {error_log}. The DOM has likely changed. Here is the new DOM. Generate an updated script."*
*   The new script is saved to the database as `version 2`, and execution is retried.
