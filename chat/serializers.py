from rest_framework import serializers
from .models import User, Connection, Message

class UserSerializer(serializers.ModelSerializer):
	_id = serializers.IntegerField(source='id')
	profile_image = serializers.SerializerMethodField()

	class Meta:
		model = User
		fields = ['_id', 'username', 'email', 'profile_image']
	
	def get_profile_image(self, obj):
		user_profile = getattr(obj, 'userprofile', None)
		if user_profile and hasattr(user_profile, 'profile_image'):
			return user_profile.profile_image.url if user_profile.profile_image else None
		return None

class ConnectionSerializer(serializers.ModelSerializer):
	last_message = serializers.SerializerMethodField()
	sender = serializers.ReadOnlyField(source='sender.username')
	receiver = serializers.ReadOnlyField(source='receiver.username')
	sender_info = serializers.SerializerMethodField()
	receiver_info = serializers.SerializerMethodField()

	class Meta:
		model = Connection
		fields = ['id', 'sender', 'receiver', 'sender_info','receiver_info','updated', 'created','last_message','post_id']

	def get_sender_info(self, obj):
		return UserSerializer(obj.sender, context=self.context).data

	def get_receiver_info(self, obj):
		return UserSerializer(obj.receiver, context=self.context).data

	def get_last_message(self, obj):
		try:
			last_message = obj.messages.order_by('-created').first()
			if last_message:
				context = self.context
				return MessageSerializer(last_message, context=context).data
			return None
		except Exception as e:
			print(f"Error fetching last message: {e}")
			return None

class MessageSerializer(serializers.ModelSerializer):
	_id = serializers.IntegerField(source='id')
	is_me = serializers.SerializerMethodField()
	user = UserSerializer()

	class Meta:
		model = Message
		fields = [
			'_id',
			'is_me',
			'text',
			'created',
			'user'
		]

	def get_is_me(self, obj):
		return self.context['user'] == obj.user
