from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Account


@receiver(post_save, sender=CustomUser)
def create_user_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(user=instance)


@receiver(post_save, sender=CustomUser)
def save_user_account(sender, instance, **kwargs):
    instance.account.save()
