# Generated by Django 4.1.7 on 2023-04-07 09:12

import django.db.models.deletion
from django.db import migrations, models

import companies.models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("markets", "0001_initial"),
        ("portfolios", "0001_initial"),
        ("sectors", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Company",
            fields=[
                ("id", models.AutoField(primary_key=True, serialize=False)),
                ("name", models.CharField(max_length=200)),
                ("ticker", models.CharField(max_length=200)),
                ("alt_tickers", models.CharField(blank=True, default="", max_length=200)),
                ("description", models.TextField(blank=True, default="")),
                ("url", models.URLField(blank=True, default="")),
                ("color", models.CharField(max_length=200)),
                ("broker", models.CharField(max_length=200)),
                ("country_code", models.CharField(max_length=200)),
                ("isin", models.CharField(blank=True, default="", max_length=200)),
                ("is_closed", models.BooleanField(default=False)),
                ("date_created", models.DateTimeField(auto_now_add=True)),
                ("last_updated", models.DateTimeField(auto_now=True)),
                ("base_currency", models.CharField(max_length=50)),
                ("dividends_currency", models.CharField(max_length=50)),
                ("logo", models.ImageField(blank=True, null=True, upload_to=companies.models.user_directory_path)),
                (
                    "market",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT, related_name="companies", to="markets.market"
                    ),
                ),
                (
                    "portfolio",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="companies", to="portfolios.portfolio"
                    ),
                ),
                (
                    "sector",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.RESTRICT, related_name="companies", to="sectors.sector"
                    ),
                ),
            ],
            options={
                "verbose_name": "Company",
                "verbose_name_plural": "Companies",
                "ordering": ["name"],
            },
        ),
    ]
