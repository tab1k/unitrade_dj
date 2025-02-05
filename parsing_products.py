import requests
from bs4 import BeautifulSoup
import time
import random
import os
import django
from django.utils.text import slugify

# Настройка Django (замени 'your_project' на имя проекта)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'unitrade.settings')
django.setup()

from app.models import Product, Category  # Импорт моделей

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}

base_url = "https://isteels.kz/catalog/besshovnye-stalnye-truby/"  # Измени при необходимости
category_slug = "besshovnye-stalnye-truby"  # Укажи правильный slug категории

# Получаем или создаем категорию
category, created = Category.objects.get_or_create(
    slug=category_slug,
    defaults={"name": "Бесшовные стальные трубы"}
)

if created:
    print(f"✅ Создана категория: {category.name}")

def parse_page(url):
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при запросе {url}: {e}")
        return

    soup = BeautifulSoup(response.content, "html.parser")
    product_rows = soup.find_all("tr", class_="product-table__item")

    for row in product_rows:
        title_tag = row.find("div", class_="short-product__title")
        if title_tag:
            product_name = title_tag.get_text(strip=True)
            product_slug = slugify(product_name)  # Генерируем slug

            # Проверяем, есть ли уже такой продукт в базе
            if not Product.objects.filter(name=product_name).exists():
                Product.objects.create(
                    name=product_name,
                    slug=product_slug,
                    category=category  # Присваиваем категорию
                )
                print(f"✅ Добавлен: {product_name} в категорию {category.name}")
            else:
                print(f"⚠️ Уже в базе: {product_name}")

    print(f"✅ Успешно спарсили {len(product_rows)} товаров с {url}")

# Запуск парсинга нескольких страниц
for page in range(1, 100):  # Задай нужное количество страниц
    page_url = base_url if page == 1 else f"{base_url}page__{page}/"
    parse_page(page_url)
    time.sleep(random.uniform(2, 5))  # Пауза, чтобы не забанили
