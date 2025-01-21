from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from inventory.models import Item, Supplier
from users.models import User

class ItemViewSetTest(APITestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123',
            role='ADMIN'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test supplier
        self.supplier = Supplier.objects.create(
            name="Test Supplier",
            contact_person="John Doe",
            email="john@example.com",
            phone="1234567890",
            address="Test Address"
        )
        
        # Create test item
        self.item = Item.objects.create(
            name="Test Item",
            sku="TEST001",
            quantity=100,
            price=19.99,
            supplier=self.supplier,
            alert_threshold=10
        )

    def test_get_items_list(self):
        url = reverse('item-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_item(self):
        url = reverse('item-list')
        data = {
            'name': 'New Item',
            'sku': 'NEW001',
            'quantity': 50,
            'price': 29.99,
            'supplier': self.supplier.id,
            'alert_threshold': 5
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Item.objects.count(), 2)

    def test_adjust_stock(self):
        url = reverse('item-adjust-stock', kwargs={'pk': self.item.pk})
        data = {'quantity': -10}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.item.refresh_from_db()
        self.assertEqual(self.item.quantity, 90)
