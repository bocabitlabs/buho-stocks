# Generated by Django 4.1.10 on 2023-10-25 16:30

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("settings", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="usersettings",
            name="backend_hostname",
            field=models.CharField(blank=True, default="localhost:8081", max_length=200),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="sentry_dsn",
            field=models.CharField(blank=True, default="", max_length=200),
        ),
        migrations.AddField(
            model_name="usersettings",
            name="sentry_enabled",
            field=models.BooleanField(default=False),
        ),
    ]
