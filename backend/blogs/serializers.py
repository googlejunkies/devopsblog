import bleach
from rest_framework import serializers
from .models import BlogPost
from categories.serializers import CategorySerializer
from users.serializers import UserSerializer

ALLOWED_TAGS = [
    'a', 'abbr', 'acronym', 'b', 'blockquote', 'code', 'em', 'i', 'li', 'ol',
    'strong', 'ul', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'img',
    'hr', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'span'
]
ALLOWED_ATTRIBUTES = {
    'a': ['href', 'title', 'target', 'rel'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    '*': ['class', 'id']
}

def sanitize_html(raw_html: str) -> str:
    if not raw_html:
        return ""
    return bleach.clean(
        raw_html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        strip=True
    )

class BlogPostListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = UserSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    read_time = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'image',
            'author', 'category', 'status', 'published_at',
            'created_at', 'read_time', 'meta_title', 'meta_description'
        )

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.featured_image:
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return obj.featured_image_url

    def get_read_time(self, obj):
        # Estimated reading time: 200 words per minute
        word_count = len((obj.content or '').split())
        minutes = max(1, round(word_count / 200))
        return f"{minutes} min read"

class BlogPostDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    author = UserSerializer(read_only=True)
    image = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    read_time = serializers.SerializerMethodField()
    related_posts = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = (
            'id', 'title', 'slug', 'excerpt', 'content', 'image',
            'author', 'category', 'status', 'published_at', 'updated_at',
            'created_at', 'read_time', 'meta_title', 'meta_description',
            'related_posts'
        )

    def get_image(self, obj):
        request = self.context.get('request')
        if obj.featured_image:
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return obj.featured_image_url

    def get_content(self, obj):
        return sanitize_html(obj.content)

    def get_read_time(self, obj):
        word_count = len((obj.content or '').split())
        minutes = max(1, round(word_count / 200))
        return f"{minutes} min read"

    def get_related_posts(self, obj):
        request = self.context.get('request')
        related = BlogPost.objects.filter(
            category=obj.category,
            status='PUBLISHED'
        ).exclude(pk=obj.pk).order_by('-published_at')[:3]
        return BlogPostListSerializer(related, many=True, context={'request': request}).data
