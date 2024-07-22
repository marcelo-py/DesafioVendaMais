from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction
from .serializers import TransactionSerializer
from django.db.models import Count, Q, Sum
from datetime import timedelta
from django.utils import timezone


class TransactionCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        serializer = TransactionSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()

            request_account_balance = user.account.balance
            response_data = serializer.data
            response_data['new_balance'] = request_account_balance

            return Response(response_data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TransactionListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        transaction_type = request.query_params.get('transaction_type', None)

        transactions = Transaction.objects.filter(from_account__user=user) | Transaction.objects.filter(to_account__user=user)

        # Filtro para tipo de transação se o parâmetro estiver presente
        if transaction_type and transaction_type in ('deposit', 'transfer', 'withdrawal'):
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
        thirty_days_ago = timezone.now() - timedelta(days=30)

        print(f'{request.user.first_name} {request.user.last_name}')
        transactions = Transaction.objects.filter(
            from_account=account) | Transaction.objects.filter(to_account=account)
        
        # Filtra transações dos últimos 30 dias
        transactions_thirty_days = Transaction.objects.filter(
            (Q(from_account__user=request.user) | Q(to_account__user=request.user)) & 
            Q(timestamp__gte=thirty_days_ago)
        )
        
        # Calcula a soma do valor das transações dos últimos 30 dias
        total_amount_last_30_days = transactions_thirty_days.aggregate(Sum('amount'))['amount__sum']
        

        balance = account.balance
        transaction_serializer = TransactionSerializer(transactions, many=True)
        
        data = {
            'username': f'{request.user.first_name} {request.user.last_name}',
            'account_number': account.account_number,
            'balance': balance,
            'transactions': transaction_serializer.data,
            'total_amount_last_30_days': total_amount_last_30_days
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

        translate = {
            'deposit': 'Depósito',
            'withdrawal': 'Saque',
            'transfer': 'Transferência',
        }

        # Calcula a quantidade de transações por tipo mapeando com Count
        transaction_counts = filter_query.values('transaction_type').annotate(count=Count('id'))
        # Prepara os dados para o frontend
        data = {
            'labels': [translate[item['transaction_type']] for item in transaction_counts],
            'counts': [item['count'] for item in transaction_counts],
        }
        
        print(data)
        return Response(data)
    