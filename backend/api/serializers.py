from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from allauth.socialaccount.models import SocialAccount
import re

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    googleProfile = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'confirm_password', 'googleProfile']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True}
        }


    def get_googleProfile(self, obj):
        # Get all social accounts for the user and find Google account
        social_accounts = SocialAccount.objects.filter(user=obj)
        google_account = social_accounts.filter(provider='google').first()
        
        if google_account and google_account.extra_data:
            # Return Google profile picture if available
            return google_account.extra_data.get('picture', None)
        
        # If no Google profile picture, return the first two letters of the email in uppercase
        email = obj.email
        if email:
            return email[:2].upper()
        return None
    
    def validate_username(self, value):
        """Validate username."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )
        return value

    def validate_password(self, value):
        """Validate password complexity."""
        if len(value) < 8:
            raise serializers.ValidationError(
                "Password must be at least 8 characters long."
            )
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one uppercase letter."
            )
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError(
                "Password must contain at least one lowercase letter."
            )
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError(
                "Password must contain at least one number."
            )
        if not re.search(r'[!@#$%^&*]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character (!@#$%^&*)."
            )
        return value

    def validate_email(self, value):
        """Validate email format and uniqueness."""
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError(
                "Please enter a valid email address."
            )
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A user with this email already exists."
            )
        return value

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({
                "detail": "Passwords do not match."
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        email = validated_data['email']
        password = validated_data['password']
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_active=False
        )
        return user