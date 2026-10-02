from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'posts_count', 'created_at', 'updated_at')

    def get_posts_count(self, obj):
        # Count only published posts
        return obj.posts.filter(status='PUBLISHED').count()
