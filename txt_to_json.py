import json
import os
from urllib.parse import urlparse

input_file = "pr.txt"
output_file = "products.json"

categories = []

# Читаем файл построчно
with open(input_file, "r", encoding="utf-8") as file:
    for line in file:
        line = line.strip()
        if line.startswith("Введи URL категории"):
            parts = line.split(": ")
            if len(parts) == 2:
                url = parts[1].strip()
                path = urlparse(url).path
                slug = path.strip("/").split("/")[-1]  # Берем последний элемент пути

                categories.append({
                    "url": url,
                    "slug": slug
                })

# Записываем в JSON
with open(output_file, "w", encoding="utf-8") as file:
    json.dump(categories, file, ensure_ascii=False, indent=4)

print(f"✅ Файл {output_file} успешно создан с {len(categories)} категориями!")
