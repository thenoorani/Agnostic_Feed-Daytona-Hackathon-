# 00 - Overview

## The Concept
An AI-powered, autonomous feed engine that turns any website into a chronological feed. It solves the problem of following updates on websites (blogs, design studios, company pages) that lack RSS feeds, without relying on brittle, manually configured scrapers.

## The Pitch
"We are building an agentic feed aggregator for the modern web. Our platform uses LLMs to dynamically generate scraping scripts for any URL. These scripts are securely executed in isolated **Daytona sandboxes** to extract the latest updates—specifically the title, subtitle, and a screenshot—and pipe them directly into a unified chronological feed on Are.Na."

## Core Features
1. **URL Submission:** Users input any URL they want to follow.
2. **Agentic Scraper:** An AI agent writes a bespoke scraping script for the URL on the fly.
3. **Secure Execution:** The generated script runs securely inside a Daytona sandbox to extract content (Title, Subtitle, Screenshot).
4. **Change Detection:** The system compares the latest extraction with previous runs to identify new content.
5. **Feed Delivery:** New content is formatted and pushed automatically to an Are.Na channel (or a custom frontend feed).

## Hackathon Scope (Daytona Hacksprint)
The primary goal is to showcase the **Daytona infrastructure** by utilizing its sandboxing capabilities to safely and scalably execute untrusted, AI-generated Python/Node.js web scrapers.
