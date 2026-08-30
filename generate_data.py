import json
import uuid
from datetime import datetime
from urllib.parse import urlparse

def format_site_name(url):
    domain = urlparse(url).netloc.replace('www.', '')
    name = domain.split('.')[0].replace('-', ' ').title()
    return name

def process_file(in_file, out_file):
    with open(in_file) as f:
        data = json.load(f)

    grouped = {}
    for item in data:
        date = item['date']
        if date > '2026-08-30':
            date = '2026-08-30'
        if date not in grouped:
            grouped[date] = []
        grouped[date].append(item)

    sorted_dates = sorted(grouped.keys(), reverse=True)
    feed_days = []
    seen_titles = set()

    def get_ordinal(n):
        if 11 <= (n % 100) <= 13: return str(n) + 'th'
        return str(n) + {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')

    for date_str in sorted_dates:
        dt = datetime.strptime(date_str, '%Y-%m-%d')
        formatted_date = f"{get_ordinal(int(dt.strftime('%d')))} of {dt.strftime('%B')}"
        
        entries = []
        for item in grouped[date_str]:
            title = item.get('article_name', 'Untitled')
            if title in seen_titles: continue
            seen_titles.add(title)
            
            main_url = item.get('main_photo_url', '')
            if not main_url:
                main_url = item.get('screenshot_base64', '')
                
            site_url = item.get('site', '')
            site_name = format_site_name(site_url) if site_url else 'Unknown'
            
            article_url = item.get('article_url', main_url)
                
            entries.append({
                "id": str(uuid.uuid4())[:8],
                "title": f"{site_name} — {title}",
                "url": article_url if article_url else "#",
                "imageUrl": main_url,
                "summary": item.get('article_description', '')
            })
            
        if not entries: continue
            
        sites = list(set([e['title'].split(' — ')[0] for e in entries]))
        if len(sites) > 1: desc = "Updates from " + ", ".join(sites[:-1]) + " and " + sites[-1] + "."
        elif len(sites) == 1: desc = "Updates from " + sites[0] + "."
        else: desc = "No updates."
        
        feed_days.append({
            "id": date_str,
            "date": formatted_date,
            "weekday": dt.strftime('%A'),
            "description": desc,
            "entries": entries
        })

    with open(out_file, 'w') as f:
        json.dump(feed_days, f, indent=2)

process_file('rest_state.json', 'frontend/src/lib/data.json')
process_file('update_state.json', 'frontend/src/lib/update_data.json')
