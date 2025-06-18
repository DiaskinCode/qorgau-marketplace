import os
import django
from faker import Faker
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bjarnama.settings')
django.setup()

from django.contrib.auth.models import User
from app.models import Post, Category, Social, Image  # Adjust this import based on your project structure

fake = Faker()

def create_post(N):
    users = list(User.objects.all())  # Assuming you have some users
    categories = list(Category.objects.all())  # Assuming you have some categories
    socials = list(Social.objects.all())  # Assuming you have some social media channels
    
    for _ in range(N):
        author = random.choice(users)
        category = random.choice(categories) if categories else None
        title = fake.sentence()
        content = fake.text(max_nb_chars=500)
        cost = fake.pystr(min_chars=3, max_chars=10)  # Adjust as necessary
        geolocation = fake.address()  # Returns (latitude, longitude, country)
        condition = fake.word()
        mortage = fake.word()
        delivery = fake.word()
        adress = fake.address()
        lat = geolocation[0]
        lng = geolocation[1]
        isActive = True
        isDeleted = fake.boolean()
        isPayed = fake.boolean()
        
        post = Post.objects.create(
            title=title,
            content=content,
            author=author,
            approved=True,
            cost=cost,
            geolocation=geolocation[3],
            condition=condition,
            mortage=mortage,
            delivery=delivery,
            adress=adress,
            lat=str(lat),
            lng=str(lng),
            isActive=isActive,
            isDeleted=isDeleted,
            isPayed=isPayed,
            categories=category
        )

        post.socials.set(random.sample(socials, random.randint(0, len(socials))))
        for _ in range(2):
            Image.objects.create(
                post=post,
                image='post_images/0img_0008.mp4',
                type='video'
            )

# Generate 50 Posts
create_post(50)
