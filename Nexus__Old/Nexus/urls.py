# Nexus/urls.py

from django.contrib import admin
from django.urls import path, include # include'u ekledik

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')), # core uygulamasının URL'lerini dahil ettik
]