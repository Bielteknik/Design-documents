# nexus_backend/asgi.py (Bu dosya Django projesiyle birlikte gelir)
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import operations.routing # Birazdan oluşturacağımız dosya

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nexus_backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            operations.routing.websocket_urlpatterns
        )
    ),
})