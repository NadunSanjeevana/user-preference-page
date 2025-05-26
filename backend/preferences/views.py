from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import UserPreferences
from .serializers import UserPreferencesSerializer

class UserPreferencesViewSet(viewsets.ModelViewSet):
    serializer_class = UserPreferencesSerializer
    
    def get_queryset(self):
        return UserPreferences.objects.filter(user=self.request.user)
    
    def get_object(self):
        return get_object_or_404(UserPreferences, user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # Check if preferences already exist for the user
        if UserPreferences.objects.filter(user=request.user).exists():
            return Response(
                {"detail": "Preferences already exist for this user. Use PUT to update."},
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
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=['get'])
    def account(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data['account'])
    
    @action(detail=False, methods=['get'])
    def notifications(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data['notifications'])
    
    @action(detail=False, methods=['get'])
    def theme(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data['theme'])
    
    @action(detail=False, methods=['get'])
    def privacy(self, request):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data['privacy']) 