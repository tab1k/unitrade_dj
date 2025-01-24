from django.db.models import Prefetch
from django.views import View
from django.views.generic import TemplateView
from .models import *
from django.shortcuts import redirect
from django.http import JsonResponse
from django.views.generic import DetailView, ListView
import requests
from bs4 import BeautifulSoup
from django.core.cache import cache
from django.shortcuts import render
from django.http import HttpResponseServerError



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


class ProcheeCategoryView(TemplateView):
    template_name = 'category/news_container.html'  # Убедитесь, что путь правильный

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.filter(parent__slug='prochee').prefetch_related('products')
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


class ProxyProductListView(View):
    template_name = 'product/product_list.html'

    def get(self, request, slug):
        # Проверяем, есть ли данные в кэше
        cache_key = f'products_{slug}'
        products = cache.get(cache_key)

        if not products:
            # Формируем правильный URL для категории
            external_url = f'https://isteels.kz/catalog/{slug}/'
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }

            try:
                # Отправляем запрос к внешнему сайту
                response = requests.get(external_url, headers=headers, timeout=10)
                response.raise_for_status()  # Генерируем исключение для HTTP ошибок

                # Парсим HTML, если ответ успешен
                html_content = response.text
                soup = BeautifulSoup(html_content, 'html.parser')

                # Извлекаем данные о продуктах
                products = []
                product_items = soup.select('.short-product__info')  # Замените '.short-product__info' на корректный селектор
                for item in product_items:
                    product_name = item.select_one('.short-product__title').get_text(strip=True)  # Имя продукта
                    product_url = item.select_one('a')['href']  # Ссылка на продукт
                    products.append({
                        'name': product_name,
                        'url': product_url,
                    })

                # Сохраняем данные в кэш на 1 час
                cache.set(cache_key, products, 3600)

            except requests.exceptions.RequestException as e:
                print(f"Ошибка при запросе к {external_url}: {e}")
                return HttpResponseServerError("Не удалось получить данные с внешнего сайта.")
            except Exception as e:
                print(f"Ошибка при парсинге HTML: {e}")
                return HttpResponseServerError("Ошибка при обработке данных с внешнего сайта.")

        return render(request, self.template_name, {'products': products, 'category_slug': slug})


class ProxyProductDetailView(View):
    template_name = 'product/product_detail.html'

    def get(self, request, slug):
        cache_key = f'product_detail_{slug}'
        product = cache.get(cache_key)

        if not product:
            external_url = f'https://isteels.kz/catalog/{slug}/'
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }

            try:
                response = requests.get(external_url, headers=headers, timeout=10)
                response.raise_for_status()

                soup = BeautifulSoup(response.text, 'html.parser')

                # Проверяем элементы перед извлечением данных
                product_name_tag = soup.select_one('.product__title.title')
                product_name = product_name_tag.get_text(strip=True) if product_name_tag else "Название не найдено"


                # Формируем продукт
                product = {
                    'name': product_name,

                }

                # Кэшируем данные
                cache.set(cache_key, product, 3600)

            except requests.exceptions.RequestException as e:
                print(f"Ошибка при запросе к {external_url}: {e}")
                return HttpResponseServerError("Не удалось получить данные с внешнего сайта.")
            except Exception as e:
                print(f"Ошибка при парсинге HTML: {e}")
                return HttpResponseServerError("Ошибка при обработке данных с внешнего сайта.")

        return render(request, self.template_name, {'product': product})



def search_products(request):
    query = request.GET.get('query', '').strip()  # Получаем запрос из GET-параметра
    results = []

    if query:
        # Поиск продуктов по названию
        products = Product.objects.filter(name__icontains=query).select_related('category')
        product_results = [
            {
                'name': product.name,
                'slug': product.slug,
                'type': 'product',
                'category': product.category.name,
                'image': product.image.url if product.image else None
            }
            for product in products
        ]

        # Поиск категорий по названию
        categories = Category.objects.filter(name__icontains=query)
        category_results = [
            {
                'name': category.name,
                'slug': category.slug,
                'type': 'category',
                'parent': category.parent.name if category.parent else None,
                'image': category.image.url if category.image else None
            }
            for category in categories
        ]

        # Объединяем результаты
        results = product_results + category_results

    # Если ничего не найдено
    if not results:
        results = [{'name': 'Ничего не найдено', 'type': 'none'}]

    return JsonResponse({'results': results})