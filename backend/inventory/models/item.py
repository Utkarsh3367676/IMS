from django.db import models
from decimal import Decimal
from .supplier import Supplier

class Item(models.Model):
    name = models.CharField(max_length=100)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)
    quantity = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))
    expiration_date = models.DateField(null=True, blank=True)
    alert_threshold = models.IntegerField(default=10)
    category = models.CharField(max_length=50, blank=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def total_value(self):
        """Calculate the total value of this item."""
        return self.price * self.quantity

    @property
    def is_low_stock(self):
        """Check if the item is below its alert threshold."""
        return self.quantity <= self.alert_threshold
