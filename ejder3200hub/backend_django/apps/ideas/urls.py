from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IdeaViewSet, VoteViewSet

router = DefaultRouter()
router.register(r'ideas', IdeaViewSet)
router.register(r'votes', VoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]