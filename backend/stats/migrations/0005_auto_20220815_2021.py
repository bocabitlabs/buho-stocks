# Generated by Django 3.2.13 on 2022-08-15 20:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stats', '0004_portfoliostatsforyear'),
    ]

    operations = [
        migrations.AddField(
            model_name='companystatsforyear',
            name='accumulated_return_percent',
            field=models.DecimalField(decimal_places=3, max_digits=12, null=True),
        ),
        migrations.AddField(
            model_name='companystatsforyear',
            name='accumulated_return_with_dividends_percent',
            field=models.DecimalField(decimal_places=3, max_digits=12, null=True),
        ),
    ]
