from django.db import models
from django.contrib.auth.models import User
        
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)

    class Meta:
        verbose_name = 'Профиль'
        verbose_name_plural = 'Профиль'

    def __str__(self):
        return self.user.username

        
class Category(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Категория'
        verbose_name_plural = 'Категории'

    def __str__(self):
        return self.name
    
class Tariff(models.Model):
    name = models.CharField(max_length=255)
    desc = models.CharField(max_length=255)
    price = models.CharField(max_length=255)

    class Meta:
        verbose_name = 'Тариф'
        verbose_name_plural = 'Тариф'

    def __str__(self):
        return self.name

class Post(models.Model):
    title = models.CharField(max_length=255, verbose_name='Заголовок')
    post_pk = models.IntegerField(default=0)
    content = models.TextField(verbose_name='Содержание')
    author = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Автор')
    approved = models.BooleanField(default=False, verbose_name='Одобрено')
    cost = models.CharField(max_length=255, default=False, verbose_name='Цена')
    geolocation = models.CharField(max_length=255, verbose_name='Геолокация')

    condition = models.CharField(max_length=255, verbose_name='Состояние')
    mortage = models.CharField(max_length=255, verbose_name='Рассрочка')
    delivery = models.CharField(max_length=255, verbose_name='Доставка')

    views = models.IntegerField(default=0,verbose_name='Просмотры')

    tariff = models.ForeignKey(Tariff, on_delete=models.CASCADE, null=True, blank=True, verbose_name='Тариф')

    date = models.DateField(auto_now=True, verbose_name='Дата')
    adress = models.CharField(max_length=255, default='', verbose_name='Адрес',blank=True)
    lat = models.CharField(max_length=255, default='', verbose_name='Широта',blank=True)
    lng = models.CharField(max_length=255, default='', verbose_name='Долгота',blank=True)
    isActive = models.BooleanField(default=True, verbose_name='Активно')
    isDeleted = models.BooleanField(default=False, verbose_name='Удалено')
    isPayed = models.BooleanField(default=False, verbose_name='Оплачено')
    categories = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True, verbose_name='Категории')
    phone = models.CharField(max_length=255, default='', blank=False, verbose_name='Телефон')
    phone_whatsapp = models.CharField(max_length=255, default='', blank=True, verbose_name='WhatsApp')
    site = models.CharField(max_length=255, default='', blank=True, verbose_name='Сайт')
    telegram = models.CharField(max_length=255, default='', blank=True, verbose_name='Telegram')
    tiktok = models.CharField(max_length=255, default='', blank=True, verbose_name='TikTok')
    facebook = models.CharField(max_length=255, default='', blank=True, verbose_name='Facebook')
    insta = models.CharField(max_length=255, default='', blank=True, verbose_name='Instagram')
    twogis = models.CharField(max_length=255, default='', blank=True, verbose_name='2GIS')
    
    class Meta:
        verbose_name = 'Пост'
        verbose_name_plural = 'Посты'
        ordering = ['-date']

    def __str__(self):
        return self.title


class Favourite(models.Model):
    user = models.ForeignKey(User, related_name='favourites', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='favourited_by', on_delete=models.CASCADE)
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='images')
    image = models.FileField(upload_to='post_images/')
    type = models.CharField(default="image",max_length=6)

    def __str__(self):
        return f"Image for {self.post.title}"

class Field(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='fields')
    field_name = models.CharField(max_length=50)
    field_value = models.CharField(max_length=255)

    def __str__(self):
        return f"Fields for {self.post.title}"