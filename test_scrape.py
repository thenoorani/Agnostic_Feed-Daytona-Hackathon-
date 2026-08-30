from playwright.sync_api import sync_playwright

def get_html(url):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(url)
        print(f"--- {url} ---")
        # print first 2000 chars of body
        print(page.content()[:2000])
        browser.close()

get_html("https://rarehistoricalphotos.com")
get_html("https://spitalfieldslife.com")
get_html("https://misfitsarchitecture.com")
get_html("https://www.vivianesassen.com/news")
