from rest_framework import serializers
from .models import Project, Task
from apps.resources.serializers import ResourceSerializer


class ProjectSerializer(serializers.ModelSerializer):
    """Project serializer"""
    manager_name = serializers.CharField(source='manager.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'code', 'status', 'status_display', 
            'priority', 'priority_display', 'start_date', 'end_date', 
            'progress', 'manager', 'manager_name', 'team', 'budget', 
            'color', 'files', 'tasks_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_tasks_count(self, obj):
        return obj.tasks.count()

    def validate_code(self, value):
        """Validate project code uniqueness"""
        if self.instance and self.instance.code == value:
            return value
        if Project.objects.filter(code=value).exists():
            raise serializers.ValidationError("Bu proje kodu zaten kullanılıyor.")
        return value

    def validate_progress(self, value):
        """Validate progress percentage"""
        if not 0 <= value <= 100:
            raise serializers.ValidationError("İlerleme yüzdesi 0-100 arasında olmalıdır.")
        return value


class ProjectDetailSerializer(ProjectSerializer):
    """Extended project serializer with relations"""
    manager = ResourceSerializer(read_only=True)
    recent_tasks = serializers.SerializerMethodField()

    def get_recent_tasks(self, obj):
        """Get 5 most recent tasks"""
        recent_tasks = obj.tasks.all()[:5]
        return TaskSerializer(recent_tasks, many=True).data


class TaskSerializer(serializers.ModelSerializer):
    """Task serializer"""
    assignee_name = serializers.CharField(source='assignee.name', read_only=True)
    reporter_name = serializers.CharField(source='reporter.name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'status_display',
            'priority', 'priority_display', 'assignee', 'assignee_name',
            'reporter', 'reporter_name', 'project', 'project_name',
            'start_date', 'end_date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskDetailSerializer(TaskSerializer):
    """Extended task serializer with relations"""
    assignee = ResourceSerializer(read_only=True)
    reporter = ResourceSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)