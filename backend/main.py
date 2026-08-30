import asyncio
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import dotenv
dotenv.load_dotenv()

from database import init_db, get_feed_items, insert_feed_item, FeedItem
from agent import process_url

dotenv.load_dotenv()

app = FastAPI(title="Agentic Feed API")

@app.on_event("startup")
def on_startup():
    init_db()

class IngestRequest(BaseModel):
    url: str

URL_LIST = [
    "https://www.vivianesassen.com/news",
    "https://gestaltz.wordpress.com",
    "https://rarehistoricalphotos.com",
    "https://spitalfieldslife.com",
    "https://misfitsarchitecture.com",
    "https://www.alaintruong.com"
]

@app.get("/api/feed")
def get_feed():
    try:
        items = get_feed_items()
        return {"feed": items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest")
async def ingest_url(req: IngestRequest):
    try:
        # process_url now returns a list of items
        results = await process_url(req.url)
        
        saved_items = []
        for res in results:
            feed_item = FeedItem(**res)
            insert_feed_item(feed_item)
            saved_items.append(feed_item.dict())
            
        return {"status": "success", "items": saved_items}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ingest_demo")
async def ingest_demo():
    """
    Triggers parallel scraping for all URLs in the demo list.
    """
    async def fetch_and_save(url):
        try:
            results = await process_url(url)
            for res in results:
                feed_item = FeedItem(**res)
                insert_feed_item(feed_item)
            print(f"✅ Successfully ingested {url}")
        except Exception as e:
            print(f"❌ Failed to ingest {url}: {e}")

    # Spin up multiple Daytona sandboxes in parallel
    await asyncio.gather(*(fetch_and_save(url) for url in URL_LIST))
    
    return {"status": "success", "message": f"Batch ingestion triggered for {len(URL_LIST)} sites."}
