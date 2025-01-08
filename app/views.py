from django.shortcuts import render
from django.views.generic import TemplateView
from .models import *
from django.views.generic import DetailView


class IndexViewPage(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Передаем категории и их продукты
        context['categories'] = (
            Category.objects.filter(parent__isnull=True)
            .order_by('id')
            .prefetch_related('children__children__children', 'products')  # Предзагрузка продуктов
        )
        return context

class ServiceViewPage(TemplateView):
    template_name ='services.html'



class CategoryDetailView(DetailView):
    model = Category
    template_name = 'category/category_detail.html'
    context_object_name = 'category'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Добавляем продукцию в контекст для отображения
        category = self.get_object()
        context['products'] = category.products.all()
        context['categories'] = Category.objects.filter(parent__isnull=True).order_by('id').prefetch_related('children')



        # Для фильтрации по другим характеристикам, вам нужно определить логику
        # например, с фильтрами по бренду, размеру и т.п.
        return context
