from django.urls import path
from .views import (
    UserCreate, 
    UserDetailView, 
    google_login_callback, 
    validate_google_token, 
    ResetPasswordView, 
    ChangePasswordView,
    VerifyEmailView,
    CustomTokenObtainPairView,  # Add CustomTokenObtainPairView
)

urlpatterns = [
    path('user/register/', UserCreate.as_view(), name='register'),
    path('auth/user/', UserDetailView.as_view(), name='user_detail'),
    path('accounts/google/login/callback/', google_login_callback, name='google_login_callback'),  # Google OAuth2 callback
    path('google/validate_token/', validate_google_token, name='validate_token'),  # Token validation
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('change-password/<str:uidb64>/<str:token>/', ChangePasswordView.as_view(), name='change_password'),
    path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Add CustomTokenObtainPairView
]