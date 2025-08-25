from django.contrib import admin
from django.urls import path
from pages.views import dashboard_view, inovasyon_view, agenda_view# View'ları import et

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', dashboard_view, name='dashboard'), # Ana sayfa
    path('inovasyon/', inovasyon_view, name='inovasyon'), # İnovasyon sayfası
    path('ajanda/', agenda_view, name='ajanda'),
]