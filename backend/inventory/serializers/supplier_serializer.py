from rest_framework import serializers
from ..models.supplier import Supplier

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'contact_person', 'email', 'phone', 
                 'address', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
