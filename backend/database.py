import sqlite3
from pydantic import BaseModel
from typing import Optional

DB_FILE = "feed.db"

class FeedItem(BaseModel):
    site: str
    date: str
    article_name: str
    article_description: Optional[str] = None
    main_photo_url: Optional[str] = None
    screenshot_base64: Optional[str] = None
    article_url: Optional[str] = None

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS feed_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site TEXT NOT NULL,
            date TEXT NOT NULL,
            article_name TEXT NOT NULL,
            article_description TEXT,
            main_photo_url TEXT,
            screenshot_base64 TEXT,
            article_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def insert_feed_item(item: FeedItem):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO feed_items (site, date, article_name, article_description, main_photo_url, screenshot_base64, article_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (item.site, item.date, item.article_name, item.article_description, item.main_photo_url, item.screenshot_base64, item.article_url))
    conn.commit()
    conn.close()

def get_feed_items():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM feed_items ORDER BY created_at DESC')
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
