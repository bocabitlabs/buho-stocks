# Generated by Django 4.1.10 on 2023-10-06 07:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("companies", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="company",
            name="broker",
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
