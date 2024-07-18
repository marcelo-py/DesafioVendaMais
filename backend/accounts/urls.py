from django.urls import path
from .views import RegisterView, AccountDetailView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('account/', AccountDetailView.as_view(), name='account-detail'),
]
