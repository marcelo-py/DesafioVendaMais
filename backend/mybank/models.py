from django.db import models
from accounts.models import Account
from django.utils import timezone
from django.db import models, transaction
from rest_framework.exceptions import APIException


class InsufficientBalanceException(APIException):
    status_code = 400
    default_detail = 'Saldo insuficiente para a transferência.'
    default_code = 'insufficient_balance'


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
    gift = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.transaction_type} of {self.amount} from {self.from_account} to {self.to_account}"
    
    def save(self, *args, **kwargs):
        if self.transaction_type == 'transfer' and self.from_account and self.to_account:
            if self.from_account.balance < self.amount:
                raise InsufficientBalanceException()

            if self.from_account != self.to_account:
                with transaction.atomic():
                    # Subtrai o saldo da conta de origem
                    print('1 Valor atual da conta>>>>', self.from_account.balance)
                    self.from_account.balance -= self.amount
                    self.from_account.save()
                    
                    # Adiciona o saldo na conta de destino
                    self.to_account.balance += self.amount
                    self.to_account.save()

        super().save(*args, **kwargs)