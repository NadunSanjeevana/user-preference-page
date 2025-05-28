"""
ASGI config for user_preferences project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'user_preferences.settings')

application = get_asgi_application() 