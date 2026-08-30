from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page()
        page.goto("https://www.vivianesassen.com/news", wait_until="networkidle")
        
        elements = page.locator(".news-item, .item, article, a").all()
        print(f"Found {len(elements)} elements")
        
        for i, el in enumerate(elements[:5]):
            html = el.evaluate("el => el.outerHTML")
            print(f"--- Item {i} ---")
            print(html[:1000])

        browser.close()

if __name__ == "__main__":
    test()
