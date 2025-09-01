from django.contrib import admin
from .models import Project, Task


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'status', 'priority', 'manager', 'progress', 'created_at']
    list_filter = ['status', 'priority', 'manager', 'created_at']
    search_fields = ['name', 'code', 'manager__name']
    autocomplete_fields = ['manager']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'priority', 'assignee', 'project', 'created_at']
    list_filter = ['status', 'priority', 'project', 'created_at']
    search_fields = ['title', 'assignee__name', 'project__name']
    autocomplete_fields = ['assignee', 'reporter', 'project']