from django.contrib import admin
from .models import Transaction


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('id', 'from_account', 'to_account')


admin.site.register(Transaction, TransactionAdmin)