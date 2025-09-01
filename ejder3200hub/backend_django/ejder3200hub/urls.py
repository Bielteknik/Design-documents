"""
URL configuration for ejder3200hub project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_root(request):
    """
    API root endpoint - welcome message
    """
    return Response({
        'message': 'Welcome to ejder3200Hub Django API! It\'s running!',
        'version': 'v1',
        'endpoints': {
            'resources': '/api/v1/resources/',
            'departments': '/api/v1/departments/',
            'projects': '/api/v1/projects/', 
            'tasks': '/api/v1/tasks/',
            'ideas': '/api/v1/ideas/',
            'events': '/api/v1/events/',
            'comments': '/api/v1/comments/',
            'feedbacks': '/api/v1/feedbacks/',
            'admin': '/admin/',
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/v1/', include([
        path('', include('apps.resources.urls')),
        path('', include('apps.projects.urls')),
        path('', include('apps.ideas.urls')),
        path('', include('apps.events.urls')),
        path('', include('apps.common.urls')),
    ])),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)