import os
import json
import asyncio
import base64
from openai import AsyncOpenAI
from daytona import AsyncDaytona
import fallback_script
import dotenv
import ssl
import certifi

# Hackathon quick-fix for MacOS Python SSL errors
ssl._create_default_https_context = ssl._create_unverified_context
os.environ['SSL_CERT_FILE'] = certifi.where()

dotenv.load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are an expert web scraper. Write a standalone Python script using `playwright` to extract the top 5 latest articles/posts from the provided URL.
Your output must be strictly executable Python code. No markdown blocks, no explanations.
The script MUST:
1. Run playwright in headless mode.
2. Extract the top 5 latest articles/posts.
3. For each article, extract:
   - 'site': The domain or name of the website.
   - 'date': The date of the article (as a string).
   - 'article_name': The title of the article.
   - 'article_description': A short summary or description.
   - 'main_photo_url': URL of the main image (or empty string if none).
   - 'screenshot_base64': Take a screenshot of the specific article element (or the viewport) and convert to base64 string. (Ensure it starts with data:image/png;base64,)
4. Print a JSON array to stdout matching EXACTLY this structure:
[
  {
    "site": "...",
    "date": "...",
    "article_name": "...",
    "article_description": "...",
    "main_photo_url": "...",
    "screenshot_base64": "data:image/png;base64,..."
  },
  ...
]
"""

async def process_url(url: str) -> list:
    try:
        # 1. Generate script via OpenAI
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Write the scraper for this URL: {url}"}
            ],
            temperature=0.2
        )
        script_code = response.choices[0].message.content.strip()
        if script_code.startswith("```python"):
            script_code = script_code[9:]
        if script_code.endswith("```"):
            script_code = script_code[:-3]

        script_code = script_code.strip()

        # 2. Execute the script in Daytona Sandbox via Python SDK
        script_code_b64 = base64.b64encode(script_code.encode()).decode()
        
        from daytona import DaytonaConfig
        config = DaytonaConfig(
            api_key=os.getenv("DAYTONA_API_KEY"),
            api_url=os.getenv("DAYTONA_SERVER_URL") or os.getenv("DAYTONA_API_URL")
        )
        
        async with AsyncDaytona(config=config) as daytona:
            print(f"Spinning up Daytona sandbox for {url}...")
            sandbox = await daytona.create()
            
            try:
                print(f"Installing playwright in sandbox for {url}...")
                await sandbox.process.exec("pip install playwright && python -m playwright install chromium --with-deps")
                
                print(f"Injecting LLM-generated code for {url}...")
                await sandbox.process.exec(f"echo {script_code_b64} | base64 -d > scrape.py")
                
                print(f"Executing scraper for {url}...")
                exec_response = await sandbox.process.exec("python scrape.py")
                
                raw_output = exec_response.result.strip()
                if not raw_output or "Error" in raw_output:
                    print(f"Scraper might have failed for {url}: {raw_output}")
                    
            finally:
                print(f"Destroying sandbox for {url}...")
                try:
                    await daytona.delete(sandbox)
                except Exception as ex:
                    print(f"Failed to delete sandbox: {ex}")

        # Parse JSON from stdout
        json_start = raw_output.find('[')
        json_end = raw_output.rfind(']') + 1
        json_str = raw_output[json_start:json_end]

        return json.loads(json_str)

    except Exception as e:
        print(f"Agent failed for {url}, falling back. Error: {e}")
        return fallback_script.get_fallback_data(url)
