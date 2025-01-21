from django.contrib import admin
from django.urls import path, include
# from rest_framework_simplejwt.views import (
#     TokenObtainPairView,
#     TokenRefreshView,
# )
from django.http import HttpResponse



def home_view(request):
    return HttpResponse("Welcome to the Inventory Management System!")



urlpatterns = [
    path("", home_view),  # Add this for the root URL
    path('admin/', admin.site.urls),
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/inventory/', include('inventory.urls')),  # Change this to 'api/inventory/'
    path('api/', include('users.urls')),  # Change this to 'api/users/'
    path('api/reports/', include('reports.urls')),  # Change this to 'api/reports/'
]
