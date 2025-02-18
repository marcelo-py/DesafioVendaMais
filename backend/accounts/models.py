from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
import random


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email


class Account(models.Model):
    account_number = models.CharField(max_length=10, unique=True, blank=True, primary_key=True)
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='account')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=50.00)

    def __str__(self):
        return f"{self.user.email} - Balance: {self.balance}"

    def save(self, *args, **kwargs):
        if not self.account_number:
            self.account_number = self.generate_account_number()
            
            super().save(*args, **kwargs)

    def generate_account_number(self):
        while True:
            account_number = ''.join([str(random.randint(0, 9)) for _ in range(10)])
            if not Account.objects.filter(account_number=account_number).exists():
                return account_number
    