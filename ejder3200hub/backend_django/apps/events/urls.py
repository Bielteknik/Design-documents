from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventRsvpViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'event-rsvps', EventRsvpViewSet)

urlpatterns = [
    path('', include(router.urls)),
]