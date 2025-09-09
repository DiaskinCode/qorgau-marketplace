from django.urls import path
from .views import PushTokenCreateView,CategoryList,TariffViewSet,search_by_sub_category,search_by_global_category,subcategory_list,user_profile, posts_by_user, delete_user,update_post,post_list,post_list_map, PostDetail, register, login_view,create_post,search_posts,active_posts, not_active_posts, deleted_posts, paid_posts, deactivate_post, activate_post, delete_post, pay_post,sort_by_category_posts, UserProfileUpdateView, create_connection,income_messages, post_list_city,stats_view, approve_post, admin_posts, add_to_favourites, remove_from_favourites, list_favourites, sort_by_category_city_posts

urlpatterns = [
    path('push-tokens/', PushTokenCreateView.as_view(), name='push-token-create'),
    path('tariffs/', TariffViewSet.as_view({'get': 'list'}), name='tariff-list'),

    # stats
    path('stats/', stats_view, name='stats-view'),
    
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('categories/<int:category_id>/subcategories/', subcategory_list, name='sub-category-list'),
    path('posts/', post_list, name='post-list'),
    path('posts_city/', post_list_city, name='post-list-city'),
    path('posts_map/', post_list_map, name='post-list-map'),
    path('posts/<int:pk>/', PostDetail.as_view(), name='post-detail'),
    path('create_post/', create_post, name='create-post'),
    path('posts/edit/<int:post_id>/', update_post, name='update-post'),

    path('user/<str:username>/', user_profile, name='user-profile'),
    path('user/<str:username>/delete/', delete_user, name='user-delete'),
    path('posts/user/<str:username>/', posts_by_user, name='user-posts'),

    path('posts/subcategory/<int:sub_category_id>/', search_by_sub_category, name='subcategory-posts'),
    path('posts/global_category/<str:global_category>/', search_by_global_category, name='global-category-posts'),
    
    path('register/', register, name='register'),
    path('login/', login_view, name='login'),
    path('search_posts/', search_posts, name='search-posts'),
    path('active_posts/', active_posts, name='active-posts'),
    path('admin_posts/', admin_posts, name='active-posts'),
    path('not_active_posts/', not_active_posts, name='not-active-posts'),
    path('deleted_posts/', deleted_posts, name='deleted-posts'),
    path('paid_posts/', paid_posts, name='paid-posts'),
    path('posts/category/<int:category_id>/',sort_by_category_posts , name='category'),
    path('posts/category-city/<int:category_id>/',sort_by_category_city_posts , name='category-city'),

    path('posts/<int:post_id>/deactivate/', deactivate_post, name='deactivate_post'),
    path('posts/<int:post_id>/activate/', activate_post, name='activate_post'),
    path('posts/<int:post_id>/approve/', approve_post, name='approve_post'),
    path('posts/<int:post_id>/delete/', delete_post, name='deleted_post'),
    path('posts/<int:post_id>/pay/', pay_post, name='pay_post'),

    # Favourites

    path('favourites/add/<int:post_id>/', add_to_favourites, name='add-to-favourites'),
    path('favourites/remove/<int:post_id>/', remove_from_favourites, name='remove-from-favourites'),
    path('favourites/', list_favourites, name='list-favourites'),

    path('update-profile/', UserProfileUpdateView.as_view(), name='update_profile'),
    
    # Chat
    path('create_connection/', create_connection, name='create_connection'),
    path('income_messages/', income_messages, name='income_messages'),
]
