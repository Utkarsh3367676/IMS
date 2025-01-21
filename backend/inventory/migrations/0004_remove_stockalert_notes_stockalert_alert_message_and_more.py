# Generated by Django 5.1.4 on 2025-01-15 12:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0003_item_created_at_item_updated_at'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stockalert',
            name='notes',
        ),
        migrations.AddField(
            model_name='stockalert',
            name='alert_message',
            field=models.CharField(default='Stock Alert', max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='stockalert',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alerts', to='inventory.item'),
        ),
        migrations.AlterField(
            model_name='supplier',
            name='address',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='supplier',
            name='name',
            field=models.CharField(max_length=100),
        ),
    ]
