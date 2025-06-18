from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Connection(models.Model):
	sender = models.ForeignKey(
		User,
		related_name='sent_connections',
		on_delete=models.CASCADE
	)
	receiver = models.ForeignKey(
		User,
		related_name='received_connections',
		on_delete=models.CASCADE
	)
	post_id = models.IntegerField(default=1)
	updated = models.DateTimeField(auto_now=True)
	created = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.sender.username + ' -> ' + self.receiver.username + ' ' + str(self.id)



class Message(models.Model):
	connection = models.ForeignKey(
		Connection,
		related_name='messages',
		on_delete=models.CASCADE
	)
	user = models.ForeignKey(
		User,
		related_name='my_messages',
		on_delete=models.CASCADE
	)
	text = models.TextField()
	created = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.user.username + ': ' + self.text