from django.contrib import admin
from django.urls import path
from django.views.generic import RedirectView
from pages.views import dashboard_view, inovasyon_view, agenda_view, login_view, logout_view # Yeni view'ları import et

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Ana sayfa (/) login sayfasına yönlendirsin
    path('', RedirectView.as_view(url='/login/', permanent=False)),
    
    # Yeni URL'ler
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    
    # Korumalı sayfalar
    path('dashboard/', dashboard_view, name='dashboard'), # Dashboard'ın yeni adresi
    path('inovasyon/', inovasyon_view, name='inovasyon'),
    path('ajanda/', agenda_view, name='ajanda'),
]