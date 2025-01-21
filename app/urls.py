from .views import *
from django.urls import path, include

app_name = 'app'

urlpatterns = [
    path('', IndexViewPage.as_view(), name='index'),
    path('category/prochee/', ProcheeCategoryView.as_view(), name='category-prochee'),
    path('services/', ServiceViewPage.as_view(), name='services'),
    path('about/', AboutViewPage.as_view(), name='about'),
    path('delivery/', DeliveryViewPage.as_view(), name='delivery'),
    path('payment', PaymentViewPage.as_view(), name='payment'),
    path('refund/', RefundViewPage.as_view(), name='refund'),
    path('contacts/', ContactViewPage.as_view(), name='contacts'),
    path('category/', CategoryViewPage.as_view(), name='category'),
    path('category/<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
    path('<slug:slug>/products/', ProductListView.as_view(), name='product_list'),
    path('product/<slug:slug>/', ProductDetailView.as_view(), name='product_detail'),

    path('search/', search_products, name='search_products'),
]

