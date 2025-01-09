from .views import *
from django.urls import path, include

app_name = 'app'

urlpatterns = [
    path('', IndexViewPage.as_view(), name='index'),
    path('services/', ServiceViewPage.as_view(), name='services'),
    path('about/', AboutViewPage.as_view(), name='about'),
    path('delivery/', DeliveryViewPage.as_view(), name='delivery'),
    path('payment', PaymentViewPage.as_view(), name='payment'),
    path('refund/', RefundViewPage.as_view(), name='refund'),
    path('category/', CategoryViewPage.as_view(), name='category'),
    path('category/<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
]

