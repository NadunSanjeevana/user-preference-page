from rest_framework import serializers
from .models import UserPreferences

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'updated_at')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Group preferences by category
        return {
            'account': {
                'username': data['username'],
                'email': data['email'],
                'firstName': data['first_name'],
                'lastName': data['last_name'],
                'phone': data['phone']
            },
            'notifications': {
                'emailNotifications': data['email_notifications'],
                'pushNotifications': data['push_notifications'],
                'smsNotifications': data['sms_notifications'],
                'frequency': data['notification_frequency'],
                'marketingEmails': data['marketing_emails'],
                'securityAlerts': data['security_alerts']
            },
            'theme': {
                'colorScheme': data['color_scheme'],
                'fontSize': data['font_size'],
                'layout': data['layout'],
                'animations': data['animations'],
                'compactMode': data['compact_mode']
            },
            'privacy': {
                'profileVisibility': data['profile_visibility'],
                'dataSharing': data['data_sharing'],
                'analyticsTracking': data['analytics_tracking'],
                'locationSharing': data['location_sharing'],
                'activityStatus': data['activity_status'],
                'searchableProfile': data['searchable_profile']
            }
        }

    def to_internal_value(self, data):
        # Transform the nested structure to flat structure
        internal_data = {
            'username': data['account']['username'],
            'email': data['account']['email'],
            'first_name': data['account']['firstName'],
            'last_name': data['account']['lastName'],
            'phone': data['account']['phone'],
            'email_notifications': data['notifications']['emailNotifications'],
            'push_notifications': data['notifications']['pushNotifications'],
            'sms_notifications': data['notifications']['smsNotifications'],
            'notification_frequency': data['notifications']['frequency'],
            'marketing_emails': data['notifications']['marketingEmails'],
            'security_alerts': data['notifications']['securityAlerts'],
            'color_scheme': data['theme']['colorScheme'],
            'font_size': data['theme']['fontSize'],
            'layout': data['theme']['layout'],
            'animations': data['theme']['animations'],
            'compact_mode': data['theme']['compactMode'],
            'profile_visibility': data['privacy']['profileVisibility'],
            'data_sharing': data['privacy']['dataSharing'],
            'analytics_tracking': data['privacy']['analyticsTracking'],
            'location_sharing': data['privacy']['locationSharing'],
            'activity_status': data['privacy']['activityStatus'],
            'searchable_profile': data['privacy']['searchableProfile']
        }
        return super().to_internal_value(internal_data) 