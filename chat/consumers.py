import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from .models import User, Connection, Message
import logging

from .serializers import (
	MessageSerializer
)
from app.serializers import (
	UserSerializer, 
)

logger = logging.getLogger(__name__)


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        user = self.scope['user']
        self.accept()
        if not user.is_authenticated:
            return

        self.username = user.username

        # Join user to group
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )



    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.username, self.channel_name
        )

    def receive(self, text_data):
        data = json.loads(text_data)
        data_source = data.get('source')

        self.send(text_data=json.dumps({"message": data.get('message')}))  
        

        if data_source == 'message.send':
            user = self.scope['user']
            connectionId = data.get('connectionId')
            message_text = data.get('message')
            receiver = User.objects.get(username=data.get('user_receiver'))
            try:
                connection = Connection.objects.get(id=connectionId)
            except Connection.DoesNotExist:
                connection = Connection.objects.create(
                    sender=user,
                    receiver=receiver,
                )
                return
            
            message = Message.objects.create(
                connection=connection,
                user=user,
                text=message_text
            )

            # Get recipient friend
            recipient = connection.sender
            if connection.sender == user:
                recipient = connection.receiver
            

            messages = Message.objects.filter(
                connection=connection
            ).order_by('-created')

            serialized_messages = MessageSerializer(
                messages,
                context={ 
                    'user': user 
                }, 
                many=True
            )

            # Send new message back to sender
            serialized_message = MessageSerializer(
                message,
                context={
                    'user': user
                }
            )
            serialized_friend = UserSerializer(recipient)
            data = {
                'message': serialized_message.data,
                'messages': serialized_messages.data,
                'friend': serialized_friend.data
            }
            self.send_group(user.username, 'message.send', data)

            # Send new message to receiver
            serialized_message = MessageSerializer(
                message,
                context={
                    'user': recipient
                }
            )
            serialized_friend = UserSerializer(user)
            data = {
                'message': serialized_message.data,
                'messages': serialized_messages.data,
                'friend': serialized_friend.data
            }
            self.send_group(recipient.username, 'message.send', data)

        elif data_source == 'message.list':
            user = self.scope['user']
            connectionId = data.get('connectionId')
            print(connectionId)
            try:
                connection = Connection.objects.get(id=connectionId)
            except Connection.DoesNotExist:
                print('Error: couldnt find connection')
                return

            messages = Message.objects.filter(
                connection=connection
            ).order_by('-created')

            serialized_messages = MessageSerializer(
                messages,
                context={ 
                    'user': user 
                }, 
                many=True
            )

            recipient = connection.sender
            if connection.sender == user:
                recipient = connection.receiver
            
            serialized_friend = UserSerializer(recipient)

            data = {
                'messages': serialized_messages.data,
            }

            self.send_group(user.username, 'message.list', data)

    def send_group(self, group, source, data):
        response = {
            'type': 'broadcast_group',
            'source': source,
            'data': data
        }
        async_to_sync(self.channel_layer.group_send)(
            group, response
        )
    
    def broadcast_group(self, data):
        '''
        data:
            - type: 'broadcast_group'
            - source: where it originated from
            - data: what ever you want to send as a dict
        '''
        print('Broadcasting to group:', data)

        '''
        return data:
            - source: where it originated from
            - data: what ever you want to send as a dict
        '''
        self.send(text_data=json.dumps(data))