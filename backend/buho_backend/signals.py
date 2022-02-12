
from django.db.models.signals import pre_save

def validate_model(sender, **kwargs):
    kwargs['instance'].clean()

pre_save.connect(validate_model, dispatch_uid='validate_models')