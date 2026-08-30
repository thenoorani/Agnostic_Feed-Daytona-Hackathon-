from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, channel="chrome")
        page = browser.new_page()
        page.goto("https://www.vivianesassen.com/news", wait_until="networkidle")
        
        # find all images and their parent anchors
        images = page.locator("img").all()
        print(f"Found {len(images)} images")
        
        for i, img in enumerate(images[:5]):
            src = img.get_attribute("src")
            print(f"Image {i}: src={src}")
            # get the parent div or anchor
            parent_html = img.evaluate("el => el.parentElement.parentElement.outerHTML")
            print(f"Parent HTML: {parent_html[:300]}")

        browser.close()

if __name__ == "__main__":
    test()
