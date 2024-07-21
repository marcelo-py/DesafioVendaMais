from django.urls import path
from .views import TransactionCreateView, TransactionListView, DashboardView, TransactionTypeStatsView

urlpatterns = [
    path('transactions/create/', TransactionCreateView.as_view(), name='transaction-create'),
    path('transactions/', TransactionListView.as_view(), name='transaction-list'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('transaction-stats/', TransactionTypeStatsView.as_view(), name='transaction-type-stats'),
]
