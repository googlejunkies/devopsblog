from django.db import models
from django.conf import settings
from django.utils.text import slugify
from django.utils import timezone

class BlogPost(models.Model):
    STATUS_CHOICES = (
        ('DRAFT', 'Draft'),
        ('PUBLISHED', 'Published'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    excerpt = models.TextField(blank=True, help_text="Short summary of the post")
    content = models.TextField(help_text="Full post content (supports Markdown or HTML)")
    featured_image = models.ImageField(upload_to='blog_images/%Y/%m/', blank=True, null=True)
    featured_image_url = models.URLField(max_length=500, blank=True, null=True, help_text="External image URL fallback or seed image")
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_posts'
    )
    category = models.ForeignKey(
        'categories.Category',
        on_delete=models.PROTECT,
        related_name='posts'
    )
    
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='DRAFT')
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta:
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    @property
    def get_image(self):
        if self.featured_image:
            return self.featured_image.url
        if self.featured_image_url:
            return self.featured_image_url
        return None

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or 'post'
            slug = base_slug
            counter = 1
            while BlogPost.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        if self.status == 'PUBLISHED' and not self.published_at:
            self.published_at = timezone.now()

        if not self.excerpt and self.content:
            # Generate excerpt from first 200 characters of content if empty
            plain_text = self.content.replace('\n', ' ').strip()
            self.excerpt = plain_text[:200] + ('...' if len(plain_text) > 200 else '')

        if not self.meta_title:
            self.meta_title = self.title

        if not self.meta_description:
            self.meta_description = self.excerpt

        super().save(*args, **kwargs)
