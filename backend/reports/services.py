

from inventory.models import Item

class ReportGenerator:
    @staticmethod
    def generate_inventory_report():
        # Fetch all items
        items = Item.objects.all()
        
        # Calculate total items
        total_items = items.count()
        
        # Get unique categories (assuming `category` field exists)
        categories = items.values_list('category', flat=True).distinct()
        
        # Calculate total stock value
        total_stock_value = sum(item.quantity * item.price for item in items)
        
        # Construct the response
        return Response({
            "total_items": total_items,
            "categories": list(categories),
            "total_stock_value": total_stock_value,
        })
    
    @staticmethod
    def generate_low_stock_report():
        # Fetch items where quantity is less than the alert threshold
        low_stock_items = Item.objects.filter(quantity__lt=models.F('alert_threshold'))
        
        # Construct the response
        low_stock_data = [
            {
                "name": item.name,
                "sku": item.sku,
                "quantity": item.quantity
            }
            for item in low_stock_items
        ]
        
        return Response({"low_stock_items": low_stock_data})
