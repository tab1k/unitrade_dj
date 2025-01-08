from django.contrib import admin
from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'parent')  # Показываем название и родительскую категорию
    prepopulated_fields = {'slug': ('name',)}  # Автозаполнение slug
    autocomplete_fields = ['parent']  # Добавляем автодополнение для выбора родительской категории
    search_fields = ('name', 'parent__name')  # Поиск по имени категории и родительской категории
    ordering = ('name',)  # Сортировка категорий по имени в алфавитном порядке

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price')
    search_fields = ('name', 'category__name')
    ordering = ('name',)