from django.db import models
from django.contrib.auth.models import User

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')
    
    # Account Preferences
    username = models.CharField(max_length=20)
    email = models.EmailField()
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    
    # Notification Preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    notification_frequency = models.CharField(
        max_length=20,
        choices=[
            ('immediate', 'Immediate'),
            ('hourly', 'Hourly'),
            ('daily', 'Daily'),
            ('weekly', 'Weekly'),
            ('never', 'Never')
        ],
        default='daily'
    )
    marketing_emails = models.BooleanField(default=False)
    security_alerts = models.BooleanField(default=True)
    
    # Theme Preferences
    color_scheme = models.CharField(
        max_length=10,
        choices=[
            ('light', 'Light'),
            ('dark', 'Dark'),
            ('auto', 'Auto')
        ],
        default='light'
    )
    font_size = models.CharField(
        max_length=20,
        choices=[
            ('small', 'Small'),
            ('medium', 'Medium'),
            ('large', 'Large'),
            ('extra-large', 'Extra Large')
        ],
        default='medium'
    )
    layout = models.CharField(
        max_length=20,
        choices=[
            ('standard', 'Standard'),
            ('compact', 'Compact'),
            ('spacious', 'Spacious')
        ],
        default='standard'
    )
    animations = models.BooleanField(default=True)
    compact_mode = models.BooleanField(default=False)
    
    # Privacy Preferences
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('friends', 'Friends Only'),
            ('private', 'Private')
        ],
        default='friends'
    )
    data_sharing = models.BooleanField(default=False)
    analytics_tracking = models.BooleanField(default=True)
    location_sharing = models.BooleanField(default=False)
    activity_status = models.BooleanField(default=True)
    searchable_profile = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s preferences"

    class Meta:
        verbose_name = "User Preferences"
        verbose_name_plural = "User Preferences" 