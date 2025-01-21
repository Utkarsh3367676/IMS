from django.contrib import admin
from .models.item import Item
from .models.supplier import Supplier
from .models.stock_alert import StockAlert

@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'quantity', 'price', 'supplier')
    search_fields = ('name', 'sku')
    list_filter = ('supplier', 'category')

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_person', 'email', 'phone')
    search_fields = ('name', 'contact_person')

@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    list_display = ('item', 'alert_message', 'is_resolved', 'threshold_reached_at')
    list_filter = ('is_resolved',)
