from rest_framework import serializers
from .models import Resource, Department


class DepartmentSerializer(serializers.ModelSerializer):
    """Department serializer"""
    children = serializers.SerializerMethodField()
    manager_name = serializers.CharField(source='manager.name', read_only=True)

    class Meta:
        model = Department
        fields = [
            'id', 'name', 'parent', 'manager', 'manager_name', 
            'children', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_children(self, obj):
        """Get child departments"""
        if obj.children.exists():
            return DepartmentSerializer(obj.children.all(), many=True).data
        return []


class ResourceSerializer(serializers.ModelSerializer):
    """Resource serializer"""
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    role_authority = serializers.ReadOnlyField()

    class Meta:
        model = Resource
        fields = [
            'id', 'name', 'email', 'role', 'role_display', 'role_authority',
            'department', 'phone', 'start_date', 'avatar', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_email(self, value):
        """Validate email uniqueness"""
        if self.instance and self.instance.email == value:
            return value
        if Resource.objects.filter(email=value).exists():
            raise serializers.ValidationError("Bu e-posta adresi zaten kullanılıyor.")
        return value


class ResourceDetailSerializer(ResourceSerializer):
    """Extended resource serializer with relations"""
    managed_projects_count = serializers.SerializerMethodField()
    assigned_tasks_count = serializers.SerializerMethodField()
    authored_ideas_count = serializers.SerializerMethodField()

    class Meta(ResourceSerializer.Meta):
        fields = ResourceSerializer.Meta.fields + [
            'managed_projects_count', 'assigned_tasks_count', 'authored_ideas_count'
        ]

    def get_managed_projects_count(self, obj):
        return obj.managed_projects.count()

    def get_assigned_tasks_count(self, obj):
        return obj.assigned_tasks.count()

    def get_authored_ideas_count(self, obj):
        return obj.authored_ideas.count()