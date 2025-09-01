"""
ASGI config for ejder3200hub project.
"""

import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ejder3200hub.settings')

application = get_asgi_application()