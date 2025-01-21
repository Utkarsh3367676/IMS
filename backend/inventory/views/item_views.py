from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, F
import csv
from ..models.item import Item
from ..serializers.item_serializer import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all().order_by('-created_at')
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Get the list of items with optional filtering.
        """
        queryset = super().get_queryset()
        
        # Search functionality
        search = self.request.query_params.get('search', '')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(sku__icontains=search) |
                Q(category__icontains=search)
            )
            
        # Category filter
        category = self.request.query_params.get('category', '')
        if category:
            queryset = queryset.filter(category=category)
            
        # Low stock filter
        low_stock = self.request.query_params.get('low_stock', '')
        if low_stock.lower() == 'true':
            queryset = queryset.filter(quantity__lte=F('alert_threshold'))
            
        return queryset

    def create(self, request, *args, **kwargs):
        """Create a new item with error handling."""
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def update(self, request, *args, **kwargs):
        """Update an item with error handling."""
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        """Delete an item with error handling."""
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            return Response(
                {'error': 'Unable to delete item. It may be referenced by other records.'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """Export items to CSV."""
        try:
            # Set response headers
            response = HttpResponse(
                content_type='text/csv',
                headers={
                    'Content-Disposition': 'attachment; filename="inventory_report.csv"',
                    'Access-Control-Expose-Headers': 'Content-Disposition'
                },
            )

            # Create the CSV writer
            writer = csv.writer(response)
            
            # Write the header row
            writer.writerow([
                'Name', 'SKU', 'Quantity', 'Price', 'Category', 
                'Total Value', 'Alert Threshold', 'Status'
            ])

            # Write the data rows
            items = self.get_queryset()
            for item in items:
                total_value = float(item.price) * item.quantity
                status = 'Low Stock' if item.quantity <= item.alert_threshold else 'In Stock'
                
                writer.writerow([
                    item.name,
                    item.sku,
                    item.quantity,
                    float(item.price),
                    getattr(item, 'category', 'N/A'),
                    total_value,
                    item.alert_threshold,
                    status
                ])

            return response
        except Exception as e:
            return Response(
                {'error': f'Failed to generate CSV: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get list of unique categories."""
        categories = Item.objects.values_list('category', flat=True).distinct()
        return Response(list(categories))

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get list of items with low stock."""
        items = Item.objects.filter(quantity__lte=F('alert_threshold'))
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)
