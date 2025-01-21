from rest_framework import serializers

class AdjustStockSerializer(serializers.Serializer):
    quantity = serializers.FloatField()
