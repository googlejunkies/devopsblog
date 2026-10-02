from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import NotFound
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import BlogPost
from .serializers import BlogPostListSerializer, BlogPostDetailSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = 'page_size'
    max_page_size = 50

class BlogPostListView(APIView):
    pagination_class = StandardResultsSetPagination

    def get(self, request):
        queryset = BlogPost.objects.filter(status='PUBLISHED').select_related('author', 'category')

        # Filter by category slug
        category_slug = request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug__iexact=category_slug)

        # Search filter
        search_query = request.query_params.get('search')
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) |
                Q(excerpt__icontains=search_query) |
                Q(content__icontains=search_query)
            )

        queryset = queryset.order_by('-published_at', '-created_at')

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(queryset, request)
        serializer = BlogPostListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

class BlogPostDetailView(APIView):
    def get(self, request, slug):
        post = get_object_or_404(BlogPost.objects.select_related('author', 'category'), slug=slug)

        # Draft security check: draft posts must not be publicly accessible
        if post.status == 'DRAFT':
            user = request.user
            is_authorized = user.is_authenticated and (user.is_staff or post.author == user)
            if not is_authorized:
                raise NotFound("Post not found.")

        serializer = BlogPostDetailSerializer(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
