FROM python:3.10

# Установка зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Установка рабочего каталога
WORKDIR /code

# Переменные окружения
ENV PYTHONUNBUFFERED 1

# Копирование зависимостей и установка
COPY requirements.txt /code/requirements.txt
RUN pip install --upgrade pip && pip install -r /code/requirements.txt

RUN pip install --no-cache-dir gunicorn

RUN apt-get update && apt-get install -y netcat-openbsd


# Копирование исходного кода
COPY . /code/

# Копирование и установка прав для entrypoint
COPY ./docker-entrypoint.sh /code/docker-entrypoint.sh
RUN chmod +x /code/docker-entrypoint.sh

# Установка прав на статику и медиа
RUN mkdir -p /code/unitrade_dj/staticfiles /code/unitrade_dj/media

CMD ["/code/docker-entrypoint.sh"]
