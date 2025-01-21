from rest_framework import serializers
from ..models.stock_alert import StockAlert
from ..models.item import Item

class StockAlertSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    current_quantity = serializers.SerializerMethodField()

    class Meta:
        model = StockAlert
        fields = [
            'id',
            'item',
            'item_name',
            'alert_message',
            'is_resolved',
            'threshold_reached_at',
            'resolved_at',
            'current_quantity'
        ]

    def get_item_name(self, obj):
        return obj.item.name if obj.item else None

    def get_current_quantity(self, obj):
        return obj.item.quantity if obj.item else None