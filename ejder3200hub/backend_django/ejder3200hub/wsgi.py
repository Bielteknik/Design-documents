"""
WSGI config for ejder3200hub project.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ejder3200hub.settings')

application = get_wsgi_application()