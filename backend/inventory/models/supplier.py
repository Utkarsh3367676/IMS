from django.db import models
from django.apps import apps
from django.db.models import Sum, F


class SupplierManager(models.Manager):
    def get_items(self):
        Item = apps.get_model('inventory', 'Item')
        return Item.objects.filter(supplier=self)
    
    def get_total_value(self):
        """Calculate total value of all items from this supplier."""
        return self.get_items().aggregate(
            total=Sum(F('price') * F('quantity'))
        )['total'] or 0


class Supplier(models.Model):
    name = models.CharField(max_length=100)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SupplierManager()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

    @property
    def total_items(self):
        """Get the total number of items from this supplier."""
        return self.item_set.count()

    @property
    def total_value(self):
        """Get the total value of all items from this supplier."""
        return self.objects.get_total_value()
