from rest_framework import serializers
from .models import Event, EventRsvp


class EventSerializer(serializers.ModelSerializer):
    """Event serializer aligned with frontend Event interface"""
    project_name = serializers.CharField(source='project.name', read_only=True)
    assignee_name = serializers.CharField(source='assignee.name', read_only=True)
    reporter_name = serializers.CharField(source='reporter.name', read_only=True)
    idea_name = serializers.CharField(source='idea.name', read_only=True)
    
    # Frontend naming compatibility
    startTime = serializers.CharField(source='start_time', required=False, allow_null=True)
    endTime = serializers.CharField(source='end_time', required=False, allow_null=True)
    projectId = serializers.CharField(source='project', required=False, allow_null=True)
    ideaId = serializers.CharField(source='idea', required=False, allow_null=True)
    assigneeId = serializers.CharField(source='assignee', required=False, allow_null=True)
    reporterId = serializers.CharField(source='reporter', required=False, allow_null=True)
    estimatedHours = serializers.IntegerField(source='estimated_hours', required=False, allow_null=True)
    startDate = serializers.CharField(source='start_date', required=False, allow_null=True)
    endDate = serializers.CharField(source='end_date', required=False, allow_null=True)
    completionDate = serializers.CharField(source='completion_date', required=False, allow_null=True)
    spentHours = serializers.IntegerField(source='spent_hours', required=False, allow_null=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    updatedAt = serializers.DateTimeField(source='updated_at', read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'date', 'type', 'description', 'content', 'tags',
            'start_time', 'startTime', 'end_time', 'endTime', 'location', 
            'participants', 'priority', 'reminder', 'project', 'projectId', 
            'project_name', 'idea', 'ideaId', 'idea_name', 'files', 
            'assignee', 'assigneeId', 'assignee_name', 'status', 'reporter', 
            'reporterId', 'reporter_name', 'category', 'estimated_hours', 
            'estimatedHours', 'start_date', 'startDate', 'end_date', 'endDate', 
            'completion_date', 'completionDate', 'dependencies', 'progress', 
            'spent_hours', 'spentHours', 'notes', 'created_at', 'createdAt', 
            'updated_at', 'updatedAt'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'createdAt', 'updatedAt']


class EventRsvpSerializer(serializers.ModelSerializer):
    event_title = serializers.CharField(source='event.title', read_only=True)
    resource_name = serializers.CharField(source='resource.name', read_only=True)
    
    class Meta:
        model = EventRsvp
        fields = [
            'id', 'event', 'event_title', 'resource', 'resource_name', 
            'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']