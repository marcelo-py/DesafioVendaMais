from rest_framework import serializers
from .models import Transaction
from accounts.models import Account


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'from_account', 'to_account', 'amount', 'gift', 'transaction_type', 'timestamp')
    
    def create(self, validated_data):
        user = self.context['request'].user
        account = Account.objects.get(user=user)
        validated_data['from_account'] = account
        return super().create(validated_data)
