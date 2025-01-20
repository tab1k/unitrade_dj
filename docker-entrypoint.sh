#!/bin/bash

# Применение миграций
echo "Applying migrations..."
python manage.py migrate

# Сборка статических файлов
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Запуск сервера
echo "Starting server..."
exec "$@"
