from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Count, Avg
from .models import Project, Task
from .serializers import (
    ProjectSerializer, ProjectDetailSerializer, 
    TaskSerializer, TaskDetailSerializer
)


class ProjectViewSet(viewsets.ModelViewSet):
    """Project CRUD operations"""
    queryset = Project.objects.select_related('manager')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'priority', 'manager']
    search_fields = ['name', 'code', 'manager__name']
    ordering_fields = ['name', 'code', 'start_date', 'end_date', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get project statistics"""
        total_projects = Project.objects.count()
        status_counts = Project.objects.values('status').annotate(count=Count('id'))
        avg_progress = Project.objects.aggregate(avg_progress=Avg('progress'))['avg_progress'] or 0
        
        return Response({
            'total_projects': total_projects,
            'average_progress': round(avg_progress, 2),
            'status_breakdown': {item['status']: item['count'] for item in status_counts}
        })

    @action(detail=True, methods=['get'])
    def tasks(self, request, pk=None):
        """Get tasks for a specific project"""
        project = self.get_object()
        tasks = project.tasks.all()
        
        status_filter = request.query_params.get('status')
        if status_filter:
            tasks = tasks.filter(status=status_filter)
            
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update project progress"""
        project = self.get_object()
        progress = request.data.get('progress')
        
        if progress is None:
            return Response(
                {'error': 'Progress field is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            progress = int(progress)
            if not 0 <= progress <= 100:
                raise ValueError
        except ValueError:
            return Response(
                {'error': 'Progress must be between 0 and 100'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project.progress = progress
        project.save()
        
        serializer = self.get_serializer(project)
        return Response(serializer.data)


class TaskViewSet(viewsets.ModelViewSet):
    """Task CRUD operations"""
    queryset = Task.objects.select_related('assignee', 'reporter', 'project')
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'priority', 'assignee', 'project']
    search_fields = ['title', 'description', 'assignee__name', 'project__name']
    ordering_fields = ['title', 'start_date', 'end_date', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return TaskDetailSerializer
        return TaskSerializer

    @action(detail=False, methods=['get'])
    def my_tasks(self, request):
        """Get tasks assigned to current user (if user system is implemented)"""
        # For now, return all tasks - implement user filtering when auth is added
        assignee_id = request.query_params.get('assignee_id')
        if assignee_id:
            tasks = Task.objects.filter(assignee_id=assignee_id)
            serializer = TaskSerializer(tasks, many=True)
            return Response(serializer.data)
        return Response({'error': 'assignee_id parameter required'}, status=400)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get task statistics"""
        total_tasks = Task.objects.count()
        status_counts = Task.objects.values('status').annotate(count=Count('id'))
        priority_counts = Task.objects.values('priority').annotate(count=Count('id'))
        
        return Response({
            'total_tasks': total_tasks,
            'status_breakdown': {item['status']: item['count'] for item in status_counts},
            'priority_breakdown': {item['priority']: item['count'] for item in priority_counts}
        })