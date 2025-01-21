from django.test import TestCase
from inventory.models import Item, Supplier, StockAlert
from django.db import IntegrityError

class ItemModelTest(TestCase):
    def setUp(self):
        self.supplier = Supplier.objects.create(
            name="Test Supplier",
            contact_person="John Doe",
            email="john@example.com",
            phone="1234567890",
            address="Test Address"
        )
        
        self.item = Item.objects.create(
            name="Test Item",
            sku="TEST001",
            quantity=100,
            price=19.99,
            supplier=self.supplier,
            alert_threshold=10
        )

    def test_item_creation(self):
        self.assertEqual(self.item.name, "Test Item")
        self.assertEqual(self.item.sku, "TEST001")

    def test_unique_sku(self):
        with self.assertRaises(IntegrityError):
            Item.objects.create(
                name="Another Item",
                sku="TEST001",
                quantity=50,
                price=29.99
            )