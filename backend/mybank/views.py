from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Transaction
from .serializers import TransactionSerializer


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
        transactions = Transaction.objects.filter(from_account__user=user) | Transaction.objects.filter(to_account__user=user)
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
    