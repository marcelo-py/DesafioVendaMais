from rest_framework import serializers
from .models import CustomUser, Account


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'date_joined', 'is_active', 'is_staff', 'password')
        extra_kwargs = {'password': {'write_only': True}}  # Não retona a senha de volta e não pode ser lida

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class AccountSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Account
        fields = ('id', 'user', 'balance')
