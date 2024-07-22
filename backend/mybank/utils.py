from django.core.mail import send_mail
from django.conf import settings


def send_transfer_notification(to_email, amount, from_account, to_account):
    subject = 'Você recebeu uma transferência'
    message = f'Você recebeu uma transferência de R${amount} da conta {from_account} para a conta {to_account}.'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [to_email]

    send_mail(subject, message, email_from, recipient_list)
    