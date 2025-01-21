import json
import os
import django

# Установите настройки Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'unitrade.settings')
django.setup()

from app.models import Category, Product

# Функция для создания продуктов из конечных категорий
def create_products(categories):
    for category in categories:
        # Проверяем, есть ли у текущей категории дочерние элементы
        if 'children' in category and category['children']:
            # Если есть дочерние элементы, обрабатываем их рекурсивно
            create_products(category['children'])
        else:
            # Если дочерних категорий нет, создаём продукт
            prod_obj, created = Product.objects.get_or_create(
                name=category['name_plural'],
                slug=category['slug'],
                description=category.get('description', ''),
                category=None  # Продукт не должен иметь подкатегорий, поэтому убираем связь с категорией
            )
            if created:
                print(f"Создан продукт: {prod_obj.name}")
            else:
                print(f"Продукт {prod_obj.name} уже существует")

if __name__ == "__main__":
    # Чтение JSON-файла
    try:
        with open('response.txt', 'r', encoding='utf-8') as file:
            data = json.load(file)
    except FileNotFoundError:
        print("Файл response.txt не найден")
        exit()
    except json.JSONDecodeError:
        print("Ошибка декодирования JSON")
        exit()

    # Импорт данных
    main_categories = data.get('main', [])
    create_products(main_categories)

    print("Импорт данных завершён.")
