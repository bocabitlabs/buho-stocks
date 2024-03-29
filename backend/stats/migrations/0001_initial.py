# Generated by Django 4.1.7 on 2023-04-07 09:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("companies", "0001_initial"),
        ("portfolios", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PortfolioStatsForYear",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("year", models.IntegerField()),
                ("invested", models.DecimalField(decimal_places=3, max_digits=12)),
                ("dividends", models.DecimalField(decimal_places=3, max_digits=12)),
                ("dividends_yield", models.DecimalField(decimal_places=3, max_digits=12, null=True)),
                ("portfolio_currency", models.CharField(max_length=200)),
                ("accumulated_investment", models.DecimalField(decimal_places=3, max_digits=12)),
                ("accumulated_dividends", models.DecimalField(decimal_places=3, max_digits=12)),
                ("portfolio_value", models.DecimalField(decimal_places=3, max_digits=12)),
                ("return_value", models.DecimalField(decimal_places=3, max_digits=12)),
                ("return_percent", models.DecimalField(decimal_places=3, max_digits=12)),
                ("return_with_dividends", models.DecimalField(decimal_places=3, max_digits=12)),
                ("return_with_dividends_percent", models.DecimalField(decimal_places=3, max_digits=12)),
                ("date_created", models.DateTimeField(auto_now_add=True)),
                ("last_updated", models.DateTimeField(auto_now=True)),
                (
                    "portfolio",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="stats", to="portfolios.portfolio"
                    ),
                ),
            ],
            options={
                "verbose_name": "Portfolio Stats",
                "verbose_name_plural": "Portfolios Stats",
                "unique_together": {("year", "portfolio")},
            },
        ),
        migrations.CreateModel(
            name="CompanyStatsForYear",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("year", models.IntegerField()),
                ("shares_count", models.IntegerField()),
                ("invested", models.DecimalField(decimal_places=3, max_digits=12)),
                ("dividends", models.DecimalField(decimal_places=3, max_digits=12)),
                ("dividends_yield", models.DecimalField(decimal_places=3, max_digits=12, null=True)),
                ("portfolio_currency", models.CharField(max_length=200)),
                ("accumulated_investment", models.DecimalField(decimal_places=3, max_digits=12)),
                ("accumulated_dividends", models.DecimalField(decimal_places=3, max_digits=12)),
                ("stock_price_value", models.DecimalField(decimal_places=3, max_digits=12, null=True)),
                ("stock_price_currency", models.CharField(default="", max_length=200)),
                ("stock_price_transaction_date", models.DateField(null=True)),
                ("portfolio_value", models.DecimalField(decimal_places=3, max_digits=12)),
                ("portfolio_value_is_down", models.BooleanField()),
                ("return_value", models.DecimalField(decimal_places=3, max_digits=12)),
                ("return_percent", models.DecimalField(decimal_places=3, max_digits=12)),
                ("accumulated_return_percent", models.DecimalField(decimal_places=3, max_digits=12, null=True)),
                ("return_with_dividends", models.DecimalField(decimal_places=3, max_digits=12)),
                ("return_with_dividends_percent", models.DecimalField(decimal_places=3, max_digits=12)),
                (
                    "accumulated_return_with_dividends_percent",
                    models.DecimalField(decimal_places=3, max_digits=12, null=True),
                ),
                ("date_created", models.DateTimeField(auto_now_add=True)),
                ("last_updated", models.DateTimeField(auto_now=True)),
                (
                    "company",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, related_name="stats", to="companies.company"
                    ),
                ),
            ],
            options={
                "verbose_name": "Company Stats",
                "verbose_name_plural": "Companies Stats",
                "unique_together": {("year", "company")},
            },
        ),
    ]
