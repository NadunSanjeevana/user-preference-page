from django.db import migrations
from django.contrib.auth.hashers import make_password

def create_default_preferences(apps, schema_editor):
    UserPreferences = apps.get_model('user_preferences', 'UserPreferences')
    User = apps.get_model('auth', 'User')
    
    # Create default user if it doesn't exist
    default_user, created = User.objects.get_or_create(
        username='default_user',
        defaults={
            'email': 'default@example.com',
            'is_active': True,
            'is_staff': True,
            'is_superuser': True,
            'password': make_password('default123')  # Set password using make_password
        }
    )
    
    # Create default preferences
    UserPreferences.objects.get_or_create(
        user=default_user,
        defaults={
            'account': {
                'username': 'default_user',
                'email': 'default@example.com',
                'firstName': 'Default',
                'lastName': 'User',
                'phone': '+1 (555) 123-4567'
            },
            'notifications': {
                'emailNotifications': True,
                'pushNotifications': True,
                'smsNotifications': False,
                'frequency': 'daily',
                'marketingEmails': False,
                'securityAlerts': True
            },
            'theme': {
                'colorScheme': 'light',
                'fontSize': 'medium',
                'layout': 'standard',
                'animations': True,
                'compactMode': False
            },
            'privacy': {
                'profileVisibility': 'friends',
                'dataSharing': False,
                'analyticsTracking': True,
                'locationSharing': False,
                'activityStatus': True,
                'searchableProfile': True
            }
        }
    )

def remove_default_preferences(apps, schema_editor):
    UserPreferences = apps.get_model('user_preferences', 'UserPreferences')
    User = apps.get_model('auth', 'User')
    
    # Remove default user and their preferences
    User.objects.filter(username='default_user').delete()

class Migration(migrations.Migration):
    dependencies = [
        ('user_preferences', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_default_preferences, remove_default_preferences),
    ] 