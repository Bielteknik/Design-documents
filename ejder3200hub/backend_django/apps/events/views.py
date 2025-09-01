from rest_framework import viewsets
from .models import Event, EventRsvp
from .serializers import EventSerializer, EventRsvpSerializer


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer


class EventRsvpViewSet(viewsets.ModelViewSet):
    queryset = EventRsvp.objects.all()
    serializer_class = EventRsvpSerializer