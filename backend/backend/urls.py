from django.contrib import admin
from django.urls import path, include
from api.views import (
    UserCreate, 
    UserDetailView, 
    DeleteUserView,
    google_login_callback, 
    validate_google_token, 
    ResetPasswordView, 
    ChangePasswordView,
    VerifyEmailView,  # Add VerifyEmailView
    CustomTokenObtainPairView  # Add CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', UserCreate.as_view(), name='register'),
    path('api/user/delete/', DeleteUserView.as_view(), name='delete_user'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='get_token'),  # Use CustomTokenObtainPairView
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('accounts/', include('allauth.urls')),  # Allauth URLs for social authentication
    path('callback/', google_login_callback, name='callback'),  # Google OAuth2 callback
    path('api/auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('api/google/validate_token/', validate_google_token, name='validate_token'),  # Token validation
    path('api/reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('api/change-password/<str:uidb64>/<str:token>/', ChangePasswordView.as_view(), name='change_password'),
    path('api/verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),  # Add VerifyEmailView
    path('api/detect/', include('detection.urls')),
    path('contact/', include('contact.urls')),
]