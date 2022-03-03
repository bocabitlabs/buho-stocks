from django.conf import settings
from datetime import timedelta

from django.conf import settings
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed


def expires_in(token: Token):
    elapsed_time = timezone.now() - token.created
    return timedelta(minutes=settings.TOKEN_EXPIRED_AFTER_MINUTES) - elapsed_time


def is_token_expired(token):
    return expires_in(token) < timedelta(seconds=0)


def handle_token_expired(token):
    Token.objects.filter(key=token).delete()


class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed("Invalid Token!")

        if not token.user.is_active:
            raise AuthenticationFailed("User inactive or deleted")

        if is_token_expired(token):
            handle_token_expired(token)
            msg = "The token is expired!, user have to login again."
            response = {"msg": msg}
            raise AuthenticationFailed(response)

        return token.user, token
