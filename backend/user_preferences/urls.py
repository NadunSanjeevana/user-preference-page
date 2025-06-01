from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from user_preferences.views import UserPreferencesViewSet, RegisterView, update_password

router = DefaultRouter()
router.register(r'preferences', UserPreferencesViewSet, basename='preferences')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/register/', RegisterView.as_view(), name='register'),
    path('api/v1/account/password/', update_password, name='update-password'),
] 