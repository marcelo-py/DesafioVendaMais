from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction
from .serializers import TransactionSerializer
from django.db.models import Count


class TransactionCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = TransactionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        transaction_type = request.query_params.get('transaction_type', None)

        # Filtro básico para transações do usuário
        transactions = Transaction.objects.filter(from_account__user=user) | Transaction.objects.filter(to_account__user=user)

        # Filtro para tipo de transação se o parâmetro estiver presente
        if transaction_type:
            print('Caiu aqui>>>>>>>', transaction_type)
            transactions = transactions.filter(
                transaction_type=transaction_type,
                from_account__user=user) | Transaction.objects.filter(
                transaction_type=transaction_type,
                to_account__user=user)

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)


class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        account = request.user.account
        print(f'{request.user.first_name} {request.user.last_name}')
        transactions = Transaction.objects.filter(
            from_account=account) | Transaction.objects.filter(to_account=account)

        balance = account.balance
        transaction_serializer = TransactionSerializer(transactions, many=True)
        
        data = {
            'username': f'{request.user.first_name} {request.user.last_name}',
            'account_number': account.account_number,
            'user_id': account.account_number,
            'balance': balance,
            'transactions': transaction_serializer.data,
        }
        
        return Response(data)
    

class TransactionTypeStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        filter_query =  Transaction.objects.filter(
            from_account__user=request.user
        ) | Transaction.objects.filter(
            to_account__user=request.user
        )
        
        # Calcula a quantidade de transações por tipo mapeando com Count
        transaction_counts = filter_query.values('transaction_type').annotate(count=Count('id'))
        # Prepara os dados para o frontend
        data = {
            'labels': [item['transaction_type'] for item in transaction_counts],
            'counts': [item['count'] for item in transaction_counts],
        }
        
        print(data)
        return Response(data)
    