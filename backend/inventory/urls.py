# # backend/inventory/urls.py
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views.item_views import ItemViewSet
# from .views.supplier_views import SupplierViewSet
# from .views.alert_views import StockAlertViewSet

# router = DefaultRouter()
# router.register(r'items', ItemViewSet)
# router.register(r'suppliers', SupplierViewSet)
# router.register(r'alerts', StockAlertViewSet)

# urlpatterns = [
#     path('', include(router.urls)),
# ]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views.item_views import ItemViewSet
from .views.alert_views import StockAlertViewSet
from .views.supplier_views import SupplierViewSet
from .views.stats_views import get_inventory_stats


router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')
router.register(r'alerts', StockAlertViewSet, basename='alert')
router.register(r'suppliers', SupplierViewSet, basename='supplier')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', get_inventory_stats, name='inventory-stats'),
]