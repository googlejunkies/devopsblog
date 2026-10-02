from django.urls import path
from .views import CategoryListView, CategoryDetailView, CategoryPostsListView

urlpatterns = [
    path('', CategoryListView.as_view(), name='category_list'),
    path('<slug:slug>/', CategoryDetailView.as_view(), name='category_detail'),
    path('<slug:slug>/posts/', CategoryPostsListView.as_view(), name='category_posts'),
]
