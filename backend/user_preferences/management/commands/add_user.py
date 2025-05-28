from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from user_preferences.models import UserPreferences

class Command(BaseCommand):
    help = 'Adds a new user with default preferences'

    def add_arguments(self, parser):
        parser.add_argument('username', type=str, help='Username for the new user')
        parser.add_argument('email', type=str, help='Email for the new user')
        parser.add_argument('password', type=str, help='Password for the new user')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        # Create default preferences
        default_preferences = {
            'account': {
                'username': username,
                'email': email,
                'firstName': '',
                'lastName': '',
                'phone': ''
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

        try:
            # Create user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            
            # Create user preferences
            UserPreferences.objects.create(
                user=user,
                account=default_preferences['account'],
                notifications=default_preferences['notifications'],
                theme=default_preferences['theme'],
                privacy=default_preferences['privacy']
            )

            self.stdout.write(
                self.style.SUCCESS(f'Successfully created user "{username}" with default preferences')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to create user: {str(e)}')
            ) 