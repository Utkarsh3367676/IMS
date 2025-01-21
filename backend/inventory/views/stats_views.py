from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count, F
from django.utils import timezone
from datetime import timedelta
from ..models import Item

@api_view(['GET'])
def get_inventory_stats(request):
    # Calculate basic stats
    total_items = Item.objects.count()
    
    # Use F() expressions for calculations
    total_value = Item.objects.aggregate(
        total=Sum(F('price') * F('quantity'))
    )['total'] or 0
    
    # Get low stock items count
    low_stock_items = Item.objects.filter(
        quantity__lte=F('alert_threshold')
    ).count()
    
    # Get category distribution
    categories = list(Item.objects.values('category')
        .annotate(count=Count('id'))
        .order_by('-count'))
    
    # Calculate stock value history (last 7 days)
    today = timezone.now().date()
    stock_value_history = []
    
    for i in range(7):
        date = today - timedelta(days=i)
        value = Item.objects.filter(
            created_at__date__lte=date
        ).aggregate(
            total=Sum(F('price') * F('quantity'))
        )['total'] or 0
        
        stock_value_history.append({
            'date': date.strftime('%Y-%m-%d'),
            'value': float(value)
        })
    
    return Response({
        'total_items': total_items,
        'total_value': float(total_value),
        'low_stock_items': low_stock_items,
        'categories': categories,
        'stock_value_history': list(reversed(stock_value_history))
    })