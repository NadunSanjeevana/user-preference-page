from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import UserPreferences
from .serializers import UserPreferencesSerializer
from django.shortcuts import get_object_or_404

class UserPreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserPreferences.objects.filter(user=self.request.user)

    def get_object(self):
        return get_object_or_404(UserPreferences, user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Check if preferences already exist
        if UserPreferences.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Preferences already exist for this user."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class PreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated access for development

    def get_queryset(self):
        return UserPreferences.objects.all()

    def perform_create(self, serializer):
        # For development, create preferences for a default user
        default_user, _ = User.objects.get_or_create(
            username='default_user',
            defaults={
                'email': 'default@example.com',
                'is_active': True,
                'is_staff': True,
                'is_superuser': True
            }
        )
        serializer.save(user=default_user)

    @action(detail=False, methods=['get'])
    def my_preferences(self, request):
        # For development, return default preferences
        default_user, _ = User.objects.get_or_create(
            username='default_user',
            defaults={
                'email': 'default@example.com',
                'is_active': True,
                'is_staff': True,
                'is_superuser': True
            }
        )
        
        preferences = UserPreferences.objects.filter(user=default_user).first()
        if not preferences:
            preferences = UserPreferences.objects.create(
                user=default_user,
                account={
                    'username': 'default_user',
                    'email': 'default@example.com',
                    'firstName': 'Default',
                    'lastName': 'User',
                    'phone': '+1 (555) 123-4567'
                },
                notifications={
                    'emailNotifications': True,
                    'pushNotifications': True,
                    'smsNotifications': False,
                    'frequency': 'daily',
                    'marketingEmails': False,
                    'securityAlerts': True
                },
                theme={
                    'colorScheme': 'light',
                    'fontSize': 'medium',
                    'layout': 'standard',
                    'animations': True,
                    'compactMode': False
                },
                privacy={
                    'profileVisibility': 'friends',
                    'dataSharing': False,
                    'analyticsTracking': True,
                    'locationSharing': False,
                    'activityStatus': True,
                    'searchableProfile': True
                }
            )
        
        serializer = self.get_serializer(preferences)
        return Response(serializer.data) 