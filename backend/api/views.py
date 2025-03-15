from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from rest_framework import generics, serializers, status
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from allauth.socialaccount.models import SocialAccount, SocialToken
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import re

User = get_user_model()

# Custom Token Obtain Pair Serializer to use email instead of username
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = User.USERNAME_FIELD

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.EmailField()
        self.fields.pop('username', None)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError(
                {"detail": "Both email and password are required."}
            )

        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            raise serializers.ValidationError(
                {"detail": "Please enter a valid email address."}
            )

        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                raise serializers.ValidationError(
                    {"detail": "Please verify your email before logging in."}
                )
            
            # Verify password
            if not user.check_password(password):
                raise serializers.ValidationError(
                    {"detail": "Invalid email or password."}
                )
            
            attrs['username'] = user.username
            attrs['email'] = user.email
            
            return super().validate(attrs)
            
        except User.DoesNotExist:
            # Use a generic error message for security
            raise serializers.ValidationError(
                {"detail": "Invalid email or password."}
            )

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserCreate(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)  # User is inactive until email is verified
        self.send_verification_email(user)
        return Response({
            "detail": "Registration successful. Please check your email for verification."
        }, status=status.HTTP_201_CREATED)

    def send_verification_email(self, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        verification_link = f"http://localhost:5173/verify-email/{uid}/{token}/"
        
        send_mail(
            subject="Verify Your Email",
            message=f"Click the link to verify your email: {verification_link}",
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user_email = user.email  # Get the user's email before deleting the account

        try:
            # Delete the user
            user.delete()

            # Send an HTML email notification
            email = EmailMessage(
                subject="Account Deletion Confirmation",
                body=(
                    f"<html>"
                    f"<body>"
                    f"<h2>Dear {user.username},</h2>"
                    f"<p>Your account has been successfully deleted. "
                    f"All your data has been permanently removed from our system.</p>"
                    f"<p>If this was a mistake or you need further assistance, "
                    f"please contact our support team at <a href='yourcancerdetective@gmail.com'>yourcancerdetective@gmail.com</a>.</p>"
                    f"<p>Thank you for using our service.</p>"
                    f"<p>Best regards,<br>The Cancer Detective Team</p>"
                    f"</body>"
                    f"</html>"
                ),
                from_email=settings.EMAIL_HOST_USER,
                to=[user_email],
            )
            email.content_subtype = "html"  # Set content type to HTML
            email.send()

            return Response(
                {"detail": "Account deleted successfully. A confirmation email has been sent."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            print(f"Error deleting account: {e}")  # Log the error for debugging
            return Response(
                {"detail": "Failed to delete account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # Check if email already exists
        if sociallogin.email_addresses:
            email = sociallogin.email_addresses[0].email
            try:
                user = User.objects.get(email=email)
                # If user exists but no social account, connect them
                if not SocialAccount.objects.filter(user=user, provider=sociallogin.account.provider).exists():
                    sociallogin.connect(request, user)
                    return
            except User.DoesNotExist:
                pass

@login_required
def google_login_callback(request):
    user = request.user
    
    # Get or create social account
    social_account = SocialAccount.objects.filter(user=user, provider='google').first()
    if not social_account:
        return redirect('http://localhost:5173/login/callback/?error=NoGoogleAccount')

    # Get the access token
    token = SocialToken.objects.filter(account=social_account).first()
    if not token:
        return redirect('http://localhost:5173/login/callback/?error=NoGoogleToken')

    # Generate JWT token
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')

@csrf_exempt
def validate_google_token(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            google_access_token = data.get('access_token')
            print("Google access token:", google_access_token)

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)

            # Validate the Google token (you can use Google's API for this)
            # For now, we'll assume the token is valid
            return JsonResponse({'valid': True})
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)
    return JsonResponse({'detail': 'Method not allowed.'}, status=405)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                if not user.is_active:
                    user.is_active = True
                    user.save()

                    # Send a welcome email after successful verification
                    email = EmailMessage(
                        subject="Email Verified Successfully",
                        body=(
                            f"<html>"
                            f"<body>"
                            f"<h2>Welcome, {user.username}!</h2>"
                            f"<p>Your email has been successfully verified. You can now log in to your account.</p>"
                            f"<p>If you have any questions or need assistance, feel free to contact us at <a href='yourcancerdetective@gmail.com'>yourcancerdetective@gmail.com</a>.</p>"
                            f"<p>Thank you for joining us!</p>"
                            f"<p>Best regards,<br>The Cancer Detective Team</p>"
                            f"</body>"
                            f"</html>"
                        ),
                        from_email=settings.EMAIL_HOST_USER,
                        to=[user.email],
                    )
                    email.content_subtype = "html"
                    email.send()

                    return Response({
                        "detail": "Email verified successfully. You can now log in."
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({
                        "detail": "Email already verified."
                    }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "detail": "Invalid verification link."
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                "detail": "Invalid verification link."
            }, status=status.HTTP_400_BAD_REQUEST)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Generate a password reset token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_link = f"http://localhost:5173/change-password/{uid}/{token}/"

        # Send the reset link via HTML email
        try:
            email = EmailMessage(
                subject="Reset Your Password",
                body=(
                    f"<html>"
                    f"<body>"
                    f"<h2>Password Reset Request</h2>"
                    f"<p>Hello {user.username},</p>"
                    f"<p>We received a request to reset your password. Click the link below to reset it:</p>"
                    f"<p><a href='{reset_link}'>{reset_link}</a></p>"
                    f"<p>If you did not request this, please ignore this email.</p>"
                    f"<p>Best regards,<br>The Cancer Detective Team</p>"
                    f"</body>"
                    f"</html>"
                ),
                from_email=settings.EMAIL_HOST_USER,
                to=[email],
            )
            email.content_subtype = "html"
            email.send()

            return Response({"detail": "Password reset link sent to your email."}, status=status.HTTP_200_OK)
        except Exception as e:
            print("Error sending email:", e)
            return Response({"detail": "Failed to send reset link. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChangePasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        new_password = request.data.get('new_password')
        if not new_password:
            return Response({"detail": "New password is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": "Invalid or expired token."}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        # Send a confirmation email after password change
        email = EmailMessage(
            subject="Password Changed Successfully",
            body=(
                f"<html>"
                f"<body>"
                f"<h2>Password Changed</h2>"
                f"<p>Hello {user.username},</p>"
                f"<p>Your password has been successfully changed.</p>"
                f"<p>If you did not make this change, please contact us immediately at <a href='yourcancerdetective@gmail.com'>yourcancerdetective@gmail.com</a>.</p>"
                f"<p>Best regards,<br>The Cancer Detective Team</p>"
                f"</body>"
                f"</html>"
            ),
            from_email=settings.EMAIL_HOST_USER,
            to=[user.email],
        )
        email.content_subtype = "html"
        email.send()

        return Response({"detail": "Password changed successfully."}, status=status.HTTP_200_OK)