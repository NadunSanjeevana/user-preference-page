from rest_framework import serializers
from .models import UserPreferences
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserPreferencesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserPreferences
        fields = ['id', 'user', 'account', 'notifications', 'theme', 'privacy', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at'] 