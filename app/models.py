from django.db import models
from django.urls import reverse
from slugify import slugify


class Category(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название категории")
    image = models.ImageField(max_length=255, blank=True, null=True, verbose_name="Картинка категории")
    slug = models.SlugField(unique=True, verbose_name="Слаг")
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children',
        verbose_name="Родительская категория"
    )

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"
        ordering = ['name']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('app:category_detail', kwargs={'slug': self.slug})


class Product(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название продукта", db_index=True)
    image = models.ImageField(upload_to='products/', verbose_name="Фото продукта")
    external_url = models.URLField(max_length=500, null=True, blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name="Категория"
    )
    slug = models.SlugField(unique=True, verbose_name="Слаг", blank=True, null=True)
    description = models.TextField(blank=True, verbose_name="Описание")
    image = models.ImageField(upload_to='products/', verbose_name="Фото продукта")

    class Meta:
        verbose_name = "Продукт"
        verbose_name_plural = "Продукты"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)  # Генерируем slug из названия
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('app:product_detail', kwargs={'slug': self.slug})


