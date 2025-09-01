from django.contrib import admin
from .models import Resource, Department


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'parent', 'manager', 'created_at']
    list_filter = ['parent', 'created_at']
    search_fields = ['name']
    autocomplete_fields = ['parent', 'manager']


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'role', 'department', 'created_at']
    list_filter = ['role', 'department', 'created_at']
    search_fields = ['name', 'email', 'department']
    readonly_fields = ['role_authority']