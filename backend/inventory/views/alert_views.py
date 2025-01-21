from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models.stock_alert import StockAlert
from ..serializers.alert_serializer import StockAlertSerializer

class StockAlertViewSet(viewsets.ModelViewSet):
    queryset = StockAlert.objects.all()
    serializer_class = StockAlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = StockAlert.objects.all().order_by('-threshold_reached_at')
        resolved = self.request.query_params.get('resolved', None)
        
        if resolved is not None:
            is_resolved = resolved.lower() == 'true'
            queryset = queryset.filter(is_resolved=is_resolved)
        
        return queryset.select_related('item')  # Optimize by including item data