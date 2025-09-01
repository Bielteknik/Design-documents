from rest_framework import serializers
from .models import Idea, Vote
from apps.resources.serializers import ResourceSerializer


class VoteSerializer(serializers.ModelSerializer):
    """Vote serializer"""
    resource_name = serializers.CharField(source='resource.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Vote
        fields = ['id', 'idea', 'resource', 'resource_name', 'status', 'status_display', 'created_at']
        read_only_fields = ['id', 'created_at']


class IdeaSerializer(serializers.ModelSerializer):
    """Idea serializer"""
    author_name = serializers.CharField(source='author.name', read_only=True)
    project_leader_name = serializers.CharField(source='project_leader.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    votes_count = serializers.SerializerMethodField()

    class Meta:
        model = Idea
        fields = [
            'id', 'name', 'status', 'status_display', 'author', 'author_name',
            'category', 'description', 'summary', 'problem', 'solution',
            'benefits', 'target_audience', 'related_departments',
            'project_leader', 'project_leader_name', 'potential_team',
            'estimated_duration', 'total_budget', 'expected_roi',
            'risk_level', 'priority', 'priority_display', 'tags',
            'votes_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_votes_count(self, obj):
        return obj.votes.count()


class IdeaDetailSerializer(IdeaSerializer):
    """Extended idea serializer with full details"""
    author = ResourceSerializer(read_only=True)
    project_leader = ResourceSerializer(read_only=True)
    votes = VoteSerializer(many=True, read_only=True)

    class Meta(IdeaSerializer.Meta):
        fields = IdeaSerializer.Meta.fields + [
            'problem_type', 'problem_frequency', 'timeline_phases',
            'critical_milestones', 'budget_items', 'expected_revenue_increase',
            'expected_cost_savings', 'funding_sources', 'revenue_sources',
            'swot_strengths', 'swot_weaknesses', 'swot_opportunities', 'swot_threats',
            'risks', 'mitigations', 'success_criteria', 'files', 'creation_date', 'votes'
        ]