from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Transaction
from .utils import send_transfer_notification


@receiver(post_save, sender=Transaction)
def notify_user_on_transfer(sender, instance, created, **kwargs):
    if created:
        if instance.transaction_type == 'transfer' and instance.to_account != instance.from_account:
            to_account = instance.to_account
            to_user_email = to_account.user.email

            send_transfer_notification(
                to_email=to_user_email,
                amount=instance.amount,
                from_account=instance.from_account.account_number,
                to_account=instance.to_account.account_number
            )
