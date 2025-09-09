from rest_framework import serializers
from .models import Post, Category, Image, UserProfile, User, Field, Tariff, SubCategory
import json

class TariffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tariff
        fields = ['id', 'name', 'desc', 'price']

class UserProfileSerializer(serializers.ModelSerializer):
    profile_image = serializers.ImageField(write_only=True)

    class Meta:
        model = UserProfile
        fields = ['phone_number', 'profile_image']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(source='userprofile', read_only=True)
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile', 'profile_image']

    def get_profile_image(self, obj):
        user_profile = getattr(obj, 'userprofile', None)
        if user_profile and hasattr(user_profile, 'profile_image'):
            return user_profile.profile_image.url if user_profile.profile_image else None
        return None


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.FileField()
    class Meta:
        model = Category
        fields = ['id', 'name', 'image']

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['id', 'name']

class ImageSerializer(serializers.ModelSerializer):
    image = serializers.FileField()
    
    class Meta:
        model = Image
        fields = ['image', 'type']

class FieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = Field
        fields = '__all__'

class PostSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    author = UserSerializer(many=False, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=Category.objects.all(),
        source='category'
    )
    category = CategorySerializer(read_only=True)

    subcategory_id = serializers.PrimaryKeyRelatedField(
        write_only=True,
        queryset=SubCategory.objects.all(),
        source='subcategory'
    )
    subcategory = serializers.StringRelatedField(read_only=True)

    fields = FieldSerializer(read_only=True, many=True)
    categories = CategorySerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = '__all__'

    def approve(self, instance):
        instance.approved = True
        instance.save()
        return instance

    def create(self, validated_data):
        if 'id' in validated_data:
            post_id = validated_data.get('id')
            if Post.objects.filter(id=post_id).exists():
                raise serializers.ValidationError({'id': 'A post with this ID already exists.'})
    
        validated_data['isActive'] = True

        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user

        images_data = validated_data.pop('images', [])
        category = validated_data.pop('categories', None)


        category = validated_data.pop('category', None)
        subcategory = validated_data.pop('subcategory', None)

        post = Post.objects.create(**validated_data)
        
        if category:
            post.category = category
        if subcategory:
            post.subcategory = subcategory
        post.save()

        fields_data = []
        for key, value in request.POST.lists():
            if key.startswith('fields[') and key.endswith('][field_name]'):
                index = key.split('[')[1].split(']')[0]  # Extract the index
                field_value_key = f'fields[{index}][field_value]'
                field_value = request.POST.get(field_value_key)
                fields_data.append({'field_name': value[0], 'field_value': field_value})

        for image_data in images_data:
            Image.objects.create(post=post, **image_data)

        for field in fields_data:
            Field.objects.create(field_name=field['field_name'], field_value=field['field_value'], post=post)

        if not post.images.exists():
            Image.objects.create(post=post)
            
        return post
