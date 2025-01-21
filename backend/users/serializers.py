from rest_framework import serializers
from .models import User
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_user(cls, validated_data):
        try:
            user = authenticate(
                username=validated_data['username'],
                password=validated_data['password']
            )
            if user is not None:
                return user
        except KeyError:
            pass
        return None

    def validate(self, attrs):
        try:
            print("\n" + "="*50)
            print("STARTING TOKEN VALIDATION")
            
            # First get the parent validation
            data = super().validate(attrs)
            
            # Get the user instance
            user = self.user
            print(f"\nUser details:")
            print(f"Username: {user.username}")
            print(f"Email: {user.email}")
            print(f"Is staff: {user.is_staff}")
            print(f"Is superuser: {user.is_superuser}")
            print(f"Groups: {[g.name for g in user.groups.all()]}")
            
            # Add user data to response
            user_data = {
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'groups': [group.name for group in user.groups.all()]
            }
            
            print("\nAdding user data to response:")
            for key, value in user_data.items():
                print(f"{key}: {value}")
            
            # Update response data with user info
            data.update(user_data)
            
            print("\nFinal response data:")
            print(data)
            print("="*50 + "\n")
            
            return data
            
        except Exception as e:
            print(f"Error in validate: {str(e)}")
            logger.error(f"Error in validate: {str(e)}")
            raise

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['groups'] = [group.name for group in user.groups.all()]

        print(f"\nToken claims for {user.username}:")
        print(f"Is staff: {user.is_staff}")
        print(f"Is superuser: {user.is_superuser}")
        print(f"Groups: {[g.name for g in user.groups.all()]}")

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # Add user data to response
        user_data = {
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'groups': [group.name for group in user.groups.all()]
        }

        print(f"\nValidating login for user: {user.username}")
        print(f"User data being added to response:")
        for key, value in user_data.items():
            print(f"{key}: {value}")

        # Update the response data
        data.update(user_data)
        return data

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        """
        Check that the email is unique.
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        """
        Check that the username is unique.
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value


# class UserCreateSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ('username', 'email', 'password', 'first_name', 
#                  'last_name', 'role', 'phone', 'department')

#     def create(self, validated_data):
#         password = validated_data.pop('password')
#         user = User(**validated_data)
#         user.set_password(password)
#         user.save()
#         return use


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        # Use create_user to hash the password
        return User.objects.create_user(**validated_data)
