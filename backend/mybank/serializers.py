from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'from_account', 'to_account', 'amount', 'transaction_type', 'timestamp')
