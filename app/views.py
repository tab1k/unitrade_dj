from django.db.models import Prefetch
from django.shortcuts import render
from django.views.generic import TemplateView
from .models import *
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.generic import DetailView, ListView


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
    template_name = 'services.html'


class AboutViewPage(TemplateView):
    template_name = 'about.html'


class DeliveryViewPage(TemplateView):
    template_name = 'buyers/delivery.html'


class PaymentViewPage(TemplateView):
    template_name = 'buyers/payment.html'


class RefundViewPage(TemplateView):
    template_name = 'buyers/refund.html'

class ContactViewPage(TemplateView):
    template_name = 'buyers/contacts.html'


class CategoryViewPage(TemplateView):
    template_name = 'category/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Передаем категории и их продукты
        context['categories'] = (
            Category.objects.filter(parent__isnull=True)
            .order_by('id')
            .only('id', 'name', 'slug')  # Загрузите только нужные поля
            .prefetch_related(
                Prefetch(
                    'children',
                    queryset=Category.objects.only('id', 'name', 'slug')
                ),
                Prefetch(
                    'children__children',
                    queryset=Category.objects.only('id', 'name', 'slug')
                ),
                Prefetch(
                    'products',
                    queryset=Product.objects.only('id', 'name', 'slug')
                )
            )
        )

        return context


class CategoryDetailView(DetailView):
    model = Category
    template_name = 'category/category_detail.html'
    context_object_name = 'category'

    def get_queryset(self):
        # Загружаем связанные данные только один раз
        return Category.objects.prefetch_related(
            'children',  # Предзагрузка подкатегорий
            'products'  # Предзагрузка продуктов
        ).select_related('parent').order_by('id')  # Сохраняем порядок категорий

    def get(self, request, *args, **kwargs):
        # Получение текущего объекта категории
        self.object = self.get_object()

        # Проверка: если подкатегорий нет, перенаправить на страницу списка продуктов
        if not self.object.children.exists():
            return redirect('app:product_list', slug=self.object.slug)

        # Если подкатегории существуют, отображаем стандартный шаблон
        return super().get(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category = self.get_object()

        # Проверим содержимое продуктов для категории
        context['products'] = category.products.all()
        print(context['products'])  # Выведет список продуктов в консоль, если это нужно

        context['categories'] = Category.objects.filter(
            parent__isnull=True
        ).order_by('id').only('id', 'name')

        return context


class ProductListView(ListView):
    model = Product
    template_name = 'product/product_list.html'
    context_object_name = 'products'

    def get_queryset(self):
        # Загружаем только продукты для текущей категории
        slug = self.kwargs.get('slug')
        category = Category.objects.get(slug=slug)
        return category.products.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        slug = self.kwargs.get('slug')
        context['category'] = Category.objects.get(slug=slug)
        return context


class ProductDetailView(DetailView):
    model = Product
    template_name = 'product/product_detail.html'
    context_object_name = 'product'


def search_products(request):
    query = request.GET.get('query', '')  # Получаем запрос из GET-параметра
    if query:
        products = Product.objects.filter(name__icontains=query)  # Поиск по имени продукта
        results = [{'name': product.name, 'slug': product.slug} for product in products]
        print(results)  # Добавьте это для отладки
    elif query.is_lower():
        results = Category.objects.filter(name__istartswith=query)  # Поиск по начальной букве категории
        results = [{'name': category.name, 'slug': category.slug} for category in results]
        print(results)  # Добавьте это для отладки
    else:
        results = []
    return JsonResponse({'results': results})