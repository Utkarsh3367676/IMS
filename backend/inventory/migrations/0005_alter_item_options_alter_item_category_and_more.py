# Generated by Django 5.1.4 on 2025-01-16 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0004_remove_stockalert_notes_stockalert_alert_message_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='item',
            options={'ordering': ['-created_at']},
        ),
        migrations.AlterField(
            model_name='item',
            name='category',
            field=models.CharField(blank=True, default='Stock Alerts', max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='item',
            name='name',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='item',
            name='quantity',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='item',
            name='sku',
            field=models.CharField(max_length=50, unique=True),
        ),
    ]
