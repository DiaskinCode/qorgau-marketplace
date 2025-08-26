from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.utils.timezone import make_aware, is_naive, now
from datetime import datetime, timedelta, time

from django.contrib.auth.models import User
from django.http import JsonResponse
import hashlib
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import urlparse
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from .models import Category, Post, UserProfile, Image, Favourite, Tariff, SubCategory
from chat.models import Connection, Message
from chat.serializers import ConnectionSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
from rest_framework.decorators import parser_classes
from .serializers import CategorySerializer, PostSerializer, UserSerializer, UserProfileSerializer, TariffSerializer, SubCategorySerializer
from pushnotifications.serializers import PushTokenSerializer
from pushnotifications.models import PushToken
import logging
from django.db.models import Case, When, Value, IntegerField, Q
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from django.db import transaction
from django.core.mail import send_mail
from django.http import HttpResponse
from pushnotifications.notifications import send_new_post_notification

class TariffViewSet(viewsets.ModelViewSet):
    queryset = Tariff.objects.all()
    serializer_class = TariffSerializer

class PushTokenCreateView(generics.CreateAPIView):
     queryset = PushToken.objects.all()
     serializer_class = PushTokenSerializer

@api_view(['POST'])
@csrf_exempt
def result_payment(request):
    merchant_password_2 = "B3K0KHMhle39s7zIQaER"

    try:
        cost = request.POST.get('OutSum')
        number = request.POST.get('InvId')
        signature = request.POST.get('SignatureValue').upper()
        # Извлекаем все Shp_ параметры
        shp_params = {key: value for key, value in request.POST.items() if key.startswith('Shp_')}

        if check_signature_result(number, cost, signature, merchant_password_2, **shp_params):
            post_id = request.POST.get('Shp_post')
            tariff = request.POST.get('Shp_tariff')
            post = Post.objects.get(post_pk=post_id)
            post.tariff = Tariff.objects.get(id=tariff)
            post.save()
            return HttpResponse(f'OK{number}')
        else:
            return HttpResponse('bad sign', status=400)
    except Exception as e:
        return HttpResponse(f'Error processing request: {str(e)}', status=500)

def check_signature_result(inv_id, out_summ, received_crc, merchant_pass2, **shp_params):
    """Функция для проверки подписи с учетом пользовательских параметров"""
    # Строим базовую строку для подписи
    string_to_hash = f"{out_summ}:{inv_id}:{merchant_pass2}"
    
    # Добавляем пользовательские параметры Shp_, если они есть, в алфавитном порядке
    shp_items = sorted((k, v) for k, v in shp_params.items() if k.startswith('Shp_'))
    for key, value in shp_items:
        string_to_hash += f":{key}={value}"

    # Вычисляем MD5-хеш
    calculated_crc = hashlib.md5(string_to_hash.encode('utf-8')).hexdigest().upper()

    # Сравниваем полученный и отправленный CRC
    return calculated_crc == received_crc


@api_view(['GET'])
def stats_view(request):
    user_count = User.objects.count()
    post_count = Post.objects.count()

    data = {
        'user_count': user_count,
        'post_count': post_count,
    }
    return JsonResponse(data)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # Define how many items you want per page
    page_size_query_param = 'page_size'  # Allow client to override the page size via query parameter
    max_page_size = 100  # Maximum limit for page size

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['GET', 'POST'])
def subcategory_list(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    
    if request.method == 'GET':
        subcategories = SubCategory.objects.filter(category=category)
        serializer = SubCategorySerializer(subcategories, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = SubCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(category=category)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def post_list_map(request):
    posts = Post.objects.exclude(
        Q(lat__isnull=True) | Q(lat='') | Q(lng__isnull=True) | Q(lng='')
    )
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def post_list_city(request):
    city = request.query_params.get('city')
    posts = Post.objects.filter(isActive=True, approved=True, geolocation=city,isDeleted=False).annotate(
        sort_order=Case(
            When(tariff__id=1, then=1),
            When(tariff__id=2, then=2),
            default=3,
            output_field=IntegerField()
        )
    ).order_by('sort_order', '-id')
    
    paginator = StandardResultsSetPagination()  
    page = paginator.paginate_queryset(posts, request)  

    if page is not None:
        serializer = PostSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data) 

    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
def post_list(request):
    if request.method == 'GET':
        posts = Post.objects.filter(isActive=True, approved=True, isDeleted=False).annotate(
            sort_order=Case(
                When(tariff__id=1, then=1),
                When(tariff__id=2, then=2),
                default=3,
                output_field=IntegerField()
            )
        ).order_by('sort_order', '-date','id')
        
        paginator = StandardResultsSetPagination()  
        page = paginator.paginate_queryset(posts, request)  

        if page is not None:
            serializer = PostSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)  

        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)


    elif request.method == 'POST':
        data = request.data
        data['author'] = request.user.id

        last_post = Post.objects.filter(author=request.user).order_by('-date').first()
        if last_post:
            last_post_date = last_post.date

            if not isinstance(last_post_date, datetime):
                last_post_date = datetime.combine(last_post_date, time.min)

            if is_naive(last_post_date):
                last_post_date = make_aware(last_post_date)

            if now() - last_post_date < timedelta(seconds=5):
                return Response(
                    {'detail': 'Пожалуйста, подождите немного перед созданием следующего поста.'},
                    status=400
                )

        print(data)
        images_data = []
        for key, value in data.items():
            if key.startswith('images'):
                image_index = int(key.split('[')[1].split(']')[0])
                image_type = key.split('[')[2].split(']')[0]
                if image_index >= len(images_data):
                    images_data.append({})
                images_data[image_index][image_type] = value

        serializer = PostSerializer(data=data, context={'request': request})

        if serializer.is_valid():
            post = serializer.save()

            for image_data in images_data:
                image_file = image_data.get('image')
                image_type = image_data.get('type')

                Image.objects.create(
                    post=post,
                    image=image_file,
                    type=image_type
                )
            # admin_user = User.objects.get(username='admin')  # Получение пользователя Admin
            # send_new_post_notification(admin_user, post.title)  # Отправка уведомления
            subject = f'Создан новый пост "{post.title}" '
            message = f'Новый пост под названием "{post.title}" был создан в {post.date} от {post.author}'
            from_email = 'oralbekov.dias19@gmail.com'
            recipient_list = ['oralbekov.dias19@gmail.com']

            send_mail(subject, message, from_email, recipient_list)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_post(request, post_id):
    post = None

    try:
        post = Post.objects.get(id=post_id, author=request.user)
    except (Post.DoesNotExist, ValueError):
        pass

    if post is None:
        try:
            post_pk = int(post_id)  # обязательно приводим к int
            post = Post.objects.get(post_pk=post_pk, author=request.user)
        except (Post.DoesNotExist, ValueError):
            return Response({"detail": "Post not found"}, status=404)

    post.approved = False
    serializer = PostSerializer(post, data=request.data, partial=True)
    if serializer.is_valid():
        updated_post = serializer.save()
    else:
        return Response(serializer.errors, status=400)

    for key in request.FILES:
        image_file = request.FILES[key]
        Image.objects.create(post=updated_post, image=image_file)

    updated_serializer = PostSerializer(updated_post)
    return JsonResponse(updated_serializer.data)



class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get(self, request, *args, **kwargs):
        post = self.get_object()
        post.views += 1  # Увеличиваем количество просмотров
        post.save(update_fields=['views'])  # Сохраняем изменения, обновляя только поле views
        return self.retrieve(request, *args, **kwargs)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@parser_classes([MultiPartParser, FormParser])
def register(request):
    with transaction.atomic():
        print(request.data)  # Check the entire request data
        print(request.data.get('profile_image')) 
        
        serialized = UserProfileSerializer(data=request.data)
        if serialized.is_valid():
            user = User.objects.create_user(
                serialized.initial_data['username'],
                serialized.initial_data['email'],
                serialized.initial_data['password']
            )

            # Now that the user is created, associate it with the profile
            profile_data = {
                "profile_image": request.data.get('profile_image'),
                "phone_number": serialized.initial_data.get('profile', {}).get('phone_number'),
                "user": user.id 
            }

            profile_serialized = UserProfileSerializer(data=profile_data)
            if profile_serialized.is_valid():
                profile_serialized.save(user=user)  # Pass the user instance here
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'token': token.key,
                    'user': UserSerializer(user).data,
                }, status=status.HTTP_201_CREATED)
            return Response(profile_serialized.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)

    if user:
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)

        # Serialize the user and user profile data
        user_data = UserSerializer(user).data

        return Response({
            'user': user_data,
            'token':token.key
        })

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_post(request):
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def search_posts(request):
    query = request.GET.get('q', '')

    if not query:
        return Response({'error': 'Please provide a search query.'}, status=400)

    results = Post.objects.filter(title__icontains=query,isActive=True,approved=True,isDeleted=False)
    serializer = PostSerializer(results, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def sort_by_category_posts(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    # Adjust ordering logic to prioritize tariff
    posts = Post.objects.filter(isActive=True,approved=True, category=category,isDeleted=False).annotate(
        sort_order=Case(
            When(tariff__id=1, then=1),
            When(tariff__id=2, then=2),
            default=3,
            output_field=IntegerField()
        )
    ).order_by('sort_order', '-id')

    paginator = StandardResultsSetPagination()  
    page = paginator.paginate_queryset(posts, request)  

    if page is not None:
        serializer = PostSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)  

    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def sort_by_category_city_posts(request, category_id):
    category = get_object_or_404(Category, pk=category_id)
    city = request.query_params.get('city')
    posts = Post.objects.filter(isActive=True,category=category,geolocation=city,isDeleted=False)
    paginator = StandardResultsSetPagination()  
    page = paginator.paginate_queryset(posts, request)  

    if page is not None:
        serializer = PostSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)  

        
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def active_posts(request):
    user = request.user
    posts = Post.objects.filter(author=user,isActive=True,isDeleted=False)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_posts(request):
    posts = Post.objects.filter(isActive=True,isDeleted=False,approved=False)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def active_posts(request):
    user = request.user
    posts = Post.objects.filter(author=user,isActive=True,isDeleted=False)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def not_active_posts(request):
    user = request.user
    posts = Post.objects.filter(author=user, isActive=False,isDeleted=False)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def deleted_posts(request):
    user = request.user
    posts = Post.objects.filter(author=user, isDeleted=True)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def paid_posts(request):
    user = request.user
    posts = Post.objects.filter(author=user,isDeleted=False,tariff=None)
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data)



@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def deactivate_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)

        if post.author != request.user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    post.isActive = False
    post.save()

    serializer = PostSerializer(post)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def activate_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id, author=request.user)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    post.isActive = True
    post.save()

    serializer = PostSerializer(post)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def approve_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)

        if not request.user.is_staff:
            return Response({'detail': 'You do not have permission to perform this action.'}, status=status.HTTP_403_FORBIDDEN)

    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = PostSerializer(post)
    serializer.approve(post)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def delete_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id, author=request.user)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    post.isDeleted = True
    post.save()

    serializer = PostSerializer(post)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def pay_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id, author=request.user)
    except Post.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    post.isPayed = True
    post.save()

    serializer = PostSerializer(post)
    return Response(serializer.data)


class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self):
        try:
            return self.request.user.userprofile
        except UserProfile.DoesNotExist:
            user_profile = UserProfile(user=self.request.user)
            user_profile.save()
            return user_profile

    def patch(self, request, *args, **kwargs):
        user = request.user

        username = request.data.get('username')
        if username:
            user.username = username

        email = request.data.get('email')
        if email:
            user.email = email
            profile = UserProfile.objects.get(user=user)
            if profile:
                profile.email = email
                profile.save()
                
        profile_image = request.FILES.get('profile_image')
        if profile_image:
            profile = UserProfile.objects.get(user=user)
            profile.profile_image = profile_image
            profile.save()

        user.save()

        phone_number = request.data.get('phone_number')
        if phone_number:
            profile = UserProfile.objects.get(user=user)
            if profile:
                profile.phone_number = phone_number
                profile.save()

        user.refresh_from_db()

        serializer = UserSerializer(user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)



# Chat

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_connection(request):
    user = request.user
    message_text = request.data.get('message')
    receiver = User.objects.get(username=request.data.get('user_receiver'))
    try:
        connection = Connection.objects.get(sender=user,receiver=receiver)
    except Connection.DoesNotExist:
        if (user == receiver):
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            connection = Connection.objects.create(
                sender=user,
                receiver=receiver,
                post_id=request.data.get('post_id')
            )

    if message_text != '':
        message = Message.objects.create(
            connection=connection,
            user=user,
            text=message_text
        )

    return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def income_messages(request):
    user = request.user
    connections = Connection.objects.filter(Q(sender=user) | Q(receiver=user))
    serializer = ConnectionSerializer(connections, many=True, context={'request': request, 'user': user})
    return Response(serializer.data)

# favourites

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_favourites(request, post_id):
    user = request.user
    try:
        post = Post.objects.get(pk=post_id)
        Favourite.objects.create(user=user, post=post)
        return Response({'message': 'Added to favourites'}, status=status.HTTP_201_CREATED)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({'error': 'Already in favourites'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_favourites(request, post_id):
    user = request.user
    try:
        favourite = Favourite.objects.get(user=user, post_id=post_id)
        favourite.delete()
        return Response({'message': 'Removed from favourites'}, status=status.HTTP_204_NO_CONTENT)
    except Favourite.DoesNotExist:
        return Response({'error': 'Not in favourites'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_favourites(request):
    user = request.user
    favourites = Favourite.objects.filter(user=user)
    posts = [favourite.post for favourite in favourites]
    serializer = PostSerializer(posts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# PROFILE

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, username):
    try:
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def posts_by_user(request, username):
    try:
        user = User.objects.get(username=username)
        posts = Post.objects.filter(author=user, isActive=True,approved=True, isDeleted=False)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)