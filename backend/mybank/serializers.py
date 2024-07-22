from rest_framework import serializers
from .models import Transaction
from accounts.models import Account


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'from_account', 'to_account', 'amount', 'gift', 'transaction_type', 'timestamp')
        extra_kwargs = {
            "amount": {
                "required": True,
                "error_messages": {
                    "required": "O campo 'amount' é obrigatório.",
                    "invalid": "O valor fornecido para 'amount' é inválido."
                }
            },
            "to_account": {
                "required": True,
                "error_messages": {
                    "required": "O campo 'to_account' é obrigatório."
                }
            },
            "transaction_type": {
                "required": True,
                "error_messages": {
                    "required": "O campo 'transaction_type' é obrigatório.",
                    "invalid_choice": "O tipo de transação fornecido não é válido. Escolha entre as opções disponíveis."
                }
            },
            "gift": {
                "read_only": True
            }
        }
    
    def validate(self, data):
        user = self.context['request'].user
        account_request = Account.objects.filter(user=user).first()

        from_account = data['from_account']
        if from_account.account_number != account_request.account_number:
            raise serializers.ValidationError({'from_account': 'Você não tem permissão para usar este account para a transação.'})
            
        if data['amount'] <= 0:
            raise serializers.ValidationError({'amount': 'O valor da transação deve ser positivo, maior que 0.'})
        
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        account = Account.objects.get(user=user)
        validated_data['from_account'] = account

        return super().create(validated_data)
