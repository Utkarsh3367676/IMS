from django.db import models
from django.utils import timezone
from .item import Item

class StockAlert(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='alerts')
    alert_message = models.CharField(max_length=255)
    is_resolved = models.BooleanField(default=False)
    threshold_reached_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Alert for {self.item.name}: {self.alert_message}"

    class Meta:
        ordering = ['-threshold_reached_at']

    def resolve(self):
        """Mark the alert as resolved."""
        self.is_resolved = True
        self.resolved_at = timezone.now()
        self.save()

    @classmethod
    def create_low_stock_alert(cls, item):
        """Create a new low stock alert for an item."""
        if item.is_low_stock and not cls.objects.filter(
            item=item,
            is_resolved=False
        ).exists():
            return cls.objects.create(
                item=item,
                alert_message=f"Low stock alert: {item.name} has {item.quantity} units remaining"
            )