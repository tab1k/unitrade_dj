from .views import *
from django.urls import path, include

app_name = 'app'

urlpatterns = [
    path('', IndexViewPage.as_view(), name='index'),
    path('services/', ServiceViewPage.as_view(), name='services'),
    path('category/<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
]

