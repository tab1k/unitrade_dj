FROM python:3.10

# Установка зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    gdal-bin \
    mime-support \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка рабочего каталога
WORKDIR /code

# Переменные окружения
ENV PYTHONUNBUFFERED 1

# Создание папок для статики и медиа-файлов
RUN mkdir -p /code/static /code/media

# Копирование зависимостей и установка
COPY requirements.txt /code/requirements.txt
RUN pip3 install --upgrade pip && pip3 install -r requirements.txt

# Копирование исходного кода
COPY . /code

# Установка прав для entrypoint
COPY ./docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x /code/docker-entrypoint.sh

# Команда запуска
CMD ["/code/docker-entrypoint.sh"]
