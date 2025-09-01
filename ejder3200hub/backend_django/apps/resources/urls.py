from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ResourceViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'resources', ResourceViewSet)
router.register(r'departments', DepartmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]