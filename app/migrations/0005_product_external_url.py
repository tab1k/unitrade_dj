# Generated by Django 5.1 on 2025-01-23 10:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0004_alter_product_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="external_url",
            field=models.URLField(blank=True, max_length=500, null=True),
        ),
    ]
