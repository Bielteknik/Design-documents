# operations/urls.py
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, DepartmentViewSet, DashboardSummaryView, TaskCommentCreateView, TaskAttachmentCreateView
from django.urls import path, include

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')
router.register(r'departments', DepartmentViewSet, basename='department')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    # Yeni URL'ler
    path('tasks/<int:task_pk>/comments/', TaskCommentCreateView.as_view(), name='task-comment-create'),
    path('tasks/<int:task_pk>/attachments/', TaskAttachmentCreateView.as_view(), name='task-attachment-create'),
    path('reporting/summary/', ReportingDataView.as_view(), name='reporting-summary'),    
]
