from django.contrib import admin
from .models import Account, CustomUser


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ('user__email',)


@admin.register(CustomUser)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'email')
    