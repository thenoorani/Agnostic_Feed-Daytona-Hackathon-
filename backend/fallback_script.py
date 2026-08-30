def get_fallback_data(url: str) -> list:
    """
    This is the safety net for your hackathon demo. 
    If OpenAI times out, generates bad code, or Daytona fails to spin up, 
    this returns perfect dummy data so the frontend UI still looks amazing on stage.
    """
    return [
        {
            "site": url,
            "date": "2026-08-30",
            "article_name": f"Demo Update 1 from {url}",
            "article_description": "This is a fallback summary generated because the agent execution failed during the live demo.",
            "main_photo_url": "",
            "screenshot_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" # 1x1 black pixel
        },
        {
            "site": url,
            "date": "2026-08-29",
            "article_name": f"Demo Update 2 from {url}",
            "article_description": "Another fallback summary.",
            "main_photo_url": "",
            "screenshot_base64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        }
    ]
