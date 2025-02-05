import json
import os
from urllib.parse import urlparse

json_file = "products.json"

# Проверяем, есть ли уже файл
if os.path.exists(json_file):
    with open(json_file, "r", encoding="utf-8") as file:
        categories = json.load(file)
else:
    categories = []

while True:
    url = input("Введи URL категории (или Enter для завершения): ").strip()
    if not url:
        break

    # Извлекаем слаг из URL
    path = urlparse(url).path
    slug = path.strip("/").split("/")[-1]  # Убираем начальный и конечный слэш, затем берем последнюю часть

    categories.append({
        "url": url,
        "slug": slug
    })

    print(f"✅ Добавлена категория с URL: {url}\n")

# Записываем в файл
with open(json_file, "w", encoding="utf-8") as file:
    json.dump(categories, file, ensure_ascii=False, indent=4)

print(f"\n✅ Файл {json_file} обновлён!")
