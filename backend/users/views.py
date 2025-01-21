from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, permissions, generics
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserCreateSerializer, UserSerializer
from rest_framework import viewsets  # Only import required classes
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

User = get_user_model()
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user.
    """
    serializer = UserCreateSerializer(data=request.data)  # Use the correct serializer
    if serializer.is_valid():
        user = serializer.save()  # Save the user and ensure password hashing
        return Response({
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer

# Login view
class LoginUserView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )

# Updated UserViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        try:
            print("\n" + "="*50)
            print(f"Login attempt for user: {request.data.get('username')}")
            
            response = super().post(request, *args, **kwargs)
            print(f"Response data: {response.data}")
            print("="*50 + "\n")
            
            return response
            
        except Exception as e:
            print(f"Error in token view: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_auth(request):
    """Test endpoint to verify user authentication and groups"""
    return Response({
        'user_id': request.user.id,
        'username': request.user.username,
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser,
        'groups': [group.name for group in request.user.groups.all()],
        'email': request.user.email
    })

@api_view(['GET'])
def test_auth(request):
    User = get_user_model()
    print("\nTesting User Model:")
    print(f"Model: {User._meta.label}")
    print(f"Table: {User._meta.db_table}")
    users = User.objects.all()
    print(f"Users in database: {users.count()}")
    for user in users:
        print(f"User {user.id}: {user.username} (staff: {user.is_staff}, super: {user.is_superuser})")
    return Response({"message": "Check server console"})

