# Agentic Feed App

This project consists of a Python FastAPI backend and a Next.js frontend. The backend uses LLM agents to write dynamic scraper scripts, which are then securely executed inside isolated Daytona sandboxes to collect data. 

## Prerequisites

- Node.js & npm (for the frontend)
- Python 3.x (for the backend and data generation scripts)

## Getting Started

### 1. Setting Up the Backend

The backend is built with FastAPI and handles scraping via Daytona sandboxes.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
   *(On Windows, use `venv\Scripts\activate`)*
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside the `backend` directory with your API keys:
   ```env
   OPENAI_API_KEY="your_openai_api_key"
   DAYTONA_API_KEY="your_daytona_api_key"
   DAYTONA_SERVER_URL="https://app.daytona.io/api"
   ```
5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will run on `http://localhost:8000`.

### 2. Generating Data with Daytona (Actual Architecture)

With the full agentic architecture running, the backend dynamically generates headless Playwright Python scripts for each target site. These scripts are executed safely in parallel inside Daytona sandboxes to scrape the sites and return JSON data to the local SQLite database.

With the backend running, trigger the live extraction process by sending a POST request to the demo ingest endpoint:

```bash
curl -X POST http://localhost:8000/api/ingest_demo
```

Alternatively, to extract data from a specific single URL:

```bash
curl -X POST http://localhost:8000/api/ingest -H "Content-Type: application/json" -d '{"url": "https://example.com"}'
```

You can then view the successfully scraped feed data from the database using:

```bash
curl http://localhost:8000/api/feed
```

### 3. Setting Up the Frontend

The frontend is a Next.js application.

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Using Static Mock Data (Fallback)

If you'd like to test the frontend without running the backend architecture, the frontend supports using static mock data files (`data.json` and `update_data.json`). To generate these files from the root state files (`rest_state.json` and `update_state.json`), run the following command from the root directory:

```bash
python generate_data.py
```

## API Endpoints (Backend)

- `GET /api/feed`: Retrieve feed items from the database.
- `POST /api/ingest`: Trigger a scrape for a single URL.
- `POST /api/ingest_demo`: Trigger parallel scraping across all URLs in the demo list using Daytona sandboxes.
