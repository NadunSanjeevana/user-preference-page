from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import UserPreferences
from .serializers import UserPreferencesSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            validate_password(request.data.get('password'))
            
            user = User.objects.create_user(
                username=request.data.get('username'),
                email=request.data.get('email'),
                password=request.data.get('password')
            )
            
            UserPreferences.objects.create(
                user=user,
                account={
                    'username': user.username,
                    'email': user.email,
                    'firstName': '',
                    'lastName': '',
                    'phone': ''
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
            
            return Response({
                'message': 'User registered successfully'
            }, status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response({
                'detail': list(e.messages)
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'detail': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

class UserPreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserPreferences.objects.filter(user=self.request.user)

    def get_object(self):
        return get_object_or_404(UserPreferences, user=self.request.user)

    def create(self, request, *args, **kwargs):
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

    @action(detail=False, methods=['get', 'put'])
    def my_preferences(self, request):
        preferences = UserPreferences.objects.filter(user=request.user).first()
        if not preferences:
            preferences = UserPreferences.objects.create(
                user=request.user,
                account={
                    'username': request.user.username,
                    'email': request.user.email,
                    'firstName': '',
                    'lastName': '',
                    'phone': ''
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
        
        if request.method == 'PUT':
            serializer = self.get_serializer(preferences, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        
        serializer = self.get_serializer(preferences)
        return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_password(request):
    try:
        print("Received password update request")
        print("Request data:", request.data)
        print("User:", request.user)
        
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')
        
        print("Current password provided:", bool(current_password))
        print("New password provided:", bool(new_password))
        
        if not current_password or not new_password:
            print("Missing password fields")
            return Response(
                {'errors': {'currentPassword': 'Current password is required', 'newPassword': 'New password is required'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not request.user.check_password(current_password):
            print("Current password verification failed")
            return Response(
                {'errors': {'currentPassword': 'Current password is incorrect'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            validate_password(new_password, request.user)
        except ValidationError as e:
            print("New password validation failed:", e.messages)
            return Response(
                {'errors': {'newPassword': e.messages[0] if e.messages else 'Invalid password format'}},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        request.user.set_password(new_password)
        request.user.save()
        
        RefreshToken.for_user(request.user)
        
        print("Password updated successfully")
        return Response(
            {'message': 'Password updated successfully'},
            status=status.HTTP_200_OK
        )
        
    except Exception as e:
        print("Error updating password:", str(e))
        return Response(
            {'errors': {'general': str(e)}},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 