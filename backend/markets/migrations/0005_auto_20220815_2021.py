# Generated by Django 3.2.13 on 2022-08-15 20:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('markets', '0004_market_timezone'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='market',
            name='color',
        ),
        migrations.RemoveField(
            model_name='market',
            name='user',
        ),
    ]