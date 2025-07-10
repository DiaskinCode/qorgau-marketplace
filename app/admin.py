from django.contrib import admin

from .models import Image, Post, Category, UserProfile, Tariff, SubCategory

class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isActive', 'approved')
    list_filter = ('isActive', 'approved')
    search_fields = ('title', 'content')

admin.site.register(Post, PostAdmin)
admin.site.register(Category)
admin.site.register(SubCategory)
admin.site.register(Tariff)
admin.site.register(UserProfile)
admin.site.register(Image)
