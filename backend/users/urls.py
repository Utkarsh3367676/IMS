from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    LoginUserView,
    register_user,
    test_auth,
    CustomTokenObtainPairView
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('register/', register_user, name='register'),
    # Remove or comment out the login endpoint as we'll use token/
    # path('login/', LoginUserView.as_view(), name='login'),
    path('', include(router.urls)),
    path('test-auth/', test_auth, name='test-auth'),
    # JWT endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]


