
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .services import ReportGenerator

class ReportViewSet(ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def inventory(self, request):
        """Generate inventory report."""
        return ReportGenerator.generate_inventory_report()
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Generate low stock report."""
        return ReportGenerator.generate_low_stock_report()
