from exponent_server_sdk import PushClient, PushMessage
from .models import PushToken

def send_push_notification(token, message):
    try:
        response = PushClient().publish(
            PushMessage(to=token, body=message)
        )
    except Exception as exc:
        # Обработка ошибок отправки уведомления
        raise

def send_new_post_notification(user, post_title):
    tokens = PushToken.objects.filter(user=user)
    message = f'New post created: {post_title}'
    for token in tokens:
        send_push_notification(token.token, message)
