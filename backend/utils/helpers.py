from django.core.mail import send_mail
from django.conf import settings
from inventory.models import StockAlert

def send_stock_alert_email(item):
    """Send email notification for low stock."""
    subject = f'Low Stock Alert: {item.name}'
    message = f'''
    Low stock alert for item:
    Name: {item.name}
    SKU: {item.sku}
    Current Quantity: {item.quantity}
    Alert Threshold: {item.alert_threshold}
    '''
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[settings.ADMIN_EMAIL],
        fail_silently=False,
    )

def calculate_stock_status(quantity, threshold):
    """Calculate stock status based on quantity and threshold."""
    if quantity <= threshold:
        return StockStatus.LOW
    elif quantity <= threshold * 2:
        return StockStatus.NORMAL
    return StockStatus.EXCESS