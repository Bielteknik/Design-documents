from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Idea, Vote
from .serializers import IdeaSerializer, IdeaDetailSerializer, VoteSerializer


class IdeaViewSet(viewsets.ModelViewSet):
    """Idea CRUD operations"""
    queryset = Idea.objects.select_related('author', 'project_leader')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'author', 'priority']
    search_fields = ['name', 'description', 'author__name']
    ordering_fields = ['name', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return IdeaDetailSerializer
        return IdeaSerializer


class VoteViewSet(viewsets.ModelViewSet):
    """Vote CRUD operations"""
    queryset = Vote.objects.select_related('idea', 'resource')
    serializer_class = VoteSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['idea', 'resource', 'status']