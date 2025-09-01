from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Resource, Department
from .serializers import ResourceSerializer, ResourceDetailSerializer, DepartmentSerializer


class DepartmentViewSet(viewsets.ModelViewSet):
    """Department CRUD operations"""
    queryset = Department.objects.select_related('manager', 'parent')
    serializer_class = DepartmentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['parent', 'manager']
    search_fields = ['name']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    @action(detail=False, methods=['get'])
    def hierarchy(self, request):
        """Get department hierarchy"""
        root_departments = Department.objects.filter(parent__isnull=True)
        serializer = self.get_serializer(root_departments, many=True)
        return Response(serializer.data)


class ResourceViewSet(viewsets.ModelViewSet):
    """Resource CRUD operations"""
    queryset = Resource.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['role', 'department']
    search_fields = ['name', 'email', 'department']
    ordering_fields = ['name', 'email', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'retrieve':
            return ResourceDetailSerializer
        return ResourceSerializer

    @action(detail=False, methods=['get'])
    def by_role(self, request):
        """Get resources grouped by role"""
        roles = {}
        for choice in Resource.Role.choices:
            role_code, role_name = choice
            resources = Resource.objects.filter(role=role_code)
            roles[role_code] = {
                'name': role_name,
                'resources': ResourceSerializer(resources, many=True).data
            }
        return Response(roles)

    @action(detail=False, methods=['get'])
    def managers(self, request):
        """Get only manager-level resources"""
        managers = Resource.objects.filter(
            role__in=[Resource.Role.SUPERADMIN, Resource.Role.ADMIN, Resource.Role.MANAGER]
        )
        serializer = ResourceSerializer(managers, many=True)
        return Response(serializer.data)