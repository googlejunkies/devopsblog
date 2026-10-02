from django.contrib import admin
from .models import BlogPost

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'status', 'published_at', 'created_at')
    list_filter = ('status', 'category', 'published_at', 'created_at')
    search_fields = ('title', 'excerpt', 'content', 'author__username', 'author__email')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',)
    date_hierarchy = 'published_at'
    list_editable = ('status',)
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'category', 'author', 'status')
        }),
        ('Content', {
            'fields': ('excerpt', 'content', 'featured_image', 'featured_image_url')
        }),
        ('Publication Dates', {
            'fields': ('published_at',)
        }),
        ('SEO Metadata', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        if not obj.author_id:
            obj.author = request.user
        super().save_model(request, obj, form, change)
