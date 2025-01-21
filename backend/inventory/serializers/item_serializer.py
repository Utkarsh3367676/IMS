from rest_framework import serializers
from ..models.item import Item

class ItemSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    total_value = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            'id',
            'name',
            'sku',
            'description',
            'quantity',
            'price',
            'category',
            'supplier',
            'supplier_name',
            'expiration_date',
            'alert_threshold',
            'total_value',
            'created_at',
            'updated_at'
        ]

    def get_total_value(self, obj):
        """Calculate total value for this item."""
        if obj.price and obj.quantity:
            return float(obj.price * obj.quantity)
        return 0.0

    def to_representation(self, instance):
        """Convert Decimal to float for JSON serialization."""
        representation = super().to_representation(instance)
        if representation.get('price'):
            representation['price'] = float(representation['price'])
        return representation

    def validate_sku(self, value):
        """Validate SKU uniqueness."""
        instance = getattr(self, 'instance', None)
        if instance is None:  # Creating new item
            if Item.objects.filter(sku=value).exists():
                raise serializers.ValidationError("This SKU already exists.")
        else:  # Updating existing item
            if Item.objects.exclude(pk=instance.pk).filter(sku=value).exists():
                raise serializers.ValidationError("This SKU already exists.")
        return value

    def validate(self, data):
        """Validate the entire object."""
        if data.get('quantity', 0) < 0:
            raise serializers.ValidationError({"quantity": "Quantity cannot be negative."})
        if data.get('price', 0) < 0:
            raise serializers.ValidationError({"price": "Price cannot be negative."})
        if data.get('alert_threshold', 0) < 0:
            raise serializers.ValidationError({"alert_threshold": "Alert threshold cannot be negative."})
        return data
    
    