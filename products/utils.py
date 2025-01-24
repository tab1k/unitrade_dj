import requests
from bs4 import BeautifulSoup

def fetch_products_from_isteels(base_url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    products = []

    try:
        response = requests.get(base_url, headers=headers)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        # Парсим товары (обнови селекторы под структуру сайта)
        for product in soup.select(".short-product__info"):
            title = product.select_one(".short-product__title").get_text(strip=True)
            link = product.select_one('a[itemprop="url"]').get("href")
            products.append({
                "title": title,
                "link": f"https://isteels.kz{link}",
            })

    except requests.RequestException as e:
        print(f"Ошибка при запросе: {e}")

    return products
