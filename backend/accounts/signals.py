from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import CustomUser, Account
from mybank.models import Transaction


@receiver(post_save, sender=CustomUser)
def create_user_account(sender, instance, created, **kwargs):
    if created:
        instance_create = Account.objects.create(user=instance)
        Transaction.objects.create(
            to_account=instance_create,
            transaction_type='deposit',
            amount=float(instance_create.balance),
            gift=True
        )

"""@receiver(post_save, sender=CustomUser)
def save_user_account(sender, instance, **kwargs):
    instance.account.save()"""
