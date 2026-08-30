import json
import uuid
from datetime import datetime

with open('rest_state.json') as f:
    data = json.load(f)

# Sort all items by date descending first, so we keep the newest if duplicates exist
# But wait, we want to just keep the first occurrence when iterating sorted dates.
# Let's group by date first.
grouped = {}
for item in data:
    date = item['date']
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
        if title in seen_titles:
            continue
        seen_titles.add(title)
        
        entries.append({
            "id": str(uuid.uuid4())[:8],
            "title": f"{item['site']} — {title}",
            "url": "#",
            "imageUrl": item.get('main_photo_url', ''),
            "summary": item.get('article_description', '')
        })
        
    # If all entries for a day were duplicates, skip the day entirely
    if not entries:
        continue
        
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

with open('frontend/src/lib/data.json', 'w') as f:
    json.dump(feed_days, f, indent=2)
