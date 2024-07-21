from django.db import models
from accounts.models import Account
from django.utils import timezone


class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ('deposit', 'Deposit'),
        ('withdrawal', 'Withdrawal'),
        ('transfer', 'Transfer'),
    )

    from_account = models.ForeignKey(Account, related_name='outgoing_transactions', on_delete=models.CASCADE, null=True, blank=True)
    to_account = models.ForeignKey(Account, related_name='incoming_transactions', on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPE_CHOICES)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} from {self.from_account} to {self.to_account}"
    
    @staticmethod
    def get_transaction_type_display(transaction_type):
        return dict(Transaction.TRANSACTION_TYPE_CHOICES).get(transaction_type, transaction_type)