from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

from settings.models import UserSettings


@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    if created:
        UserSettings.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_settings(sender, instance, **kwargs):
    instance.usersettings.save()