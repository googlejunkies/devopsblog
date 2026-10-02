from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from .models import Category
from .serializers import CategorySerializer

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by('name')
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

class CategoryDetailView(APIView):
    def get(self, request, slug):
        category = get_object_or_404(Category, slug=slug)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

class CategoryPostsListView(APIView):
    def get(self, request, slug):
        from blogs.serializers import BlogPostListSerializer
        category = get_object_or_404(Category, slug=slug)
        posts = category.posts.filter(status='PUBLISHED').select_related('author', 'category').order_by('-published_at', '-created_at')

        paginator = PageNumberPagination()
        paginated_posts = paginator.paginate_queryset(posts, request)
        serializer = BlogPostListSerializer(paginated_posts, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
