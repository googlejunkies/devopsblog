from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from categories.models import Category
from blogs.models import BlogPost

User = get_user_model()

class BlogApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='author1',
            email='author@example.com',
            password='TestPassword123!'
        )
        self.admin = User.objects.create_superuser(
            username='admin1',
            email='admin@example.com',
            password='AdminPassword123!'
        )

        self.cat_tech = Category.objects.create(name='Tech', slug='tech', description='Technology topics')
        self.cat_ai = Category.objects.create(name='AI', slug='ai', description='Artificial Intelligence')

        self.post_published = BlogPost.objects.create(
            title='Django Guide',
            slug='django-guide',
            excerpt='Learn Django properly',
            content='Full content for Django',
            author=self.user,
            category=self.cat_tech,
            status='PUBLISHED'
        )

        self.post_ai = BlogPost.objects.create(
            title='AI Guide',
            slug='ai-guide',
            excerpt='Learn AI models',
            content='Full content for AI',
            author=self.user,
            category=self.cat_ai,
            status='PUBLISHED'
        )

        self.post_draft = BlogPost.objects.create(
            title='Secret Draft',
            slug='secret-draft',
            excerpt='Confidential draft',
            content='Full draft content',
            author=self.user,
            category=self.cat_tech,
            status='DRAFT'
        )

    def test_blog_list_returns_only_published(self):
        response = self.client.get('/api/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Results are paginated
        slugs = [p['slug'] for p in response.data['results']]
        self.assertIn('django-guide', slugs)
        self.assertIn('ai-guide', slugs)
        self.assertNotIn('secret-draft', slugs)

    def test_blog_list_category_filter(self):
        response = self.client.get('/api/posts/?category=ai')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [p['slug'] for p in response.data['results']]
        self.assertIn('ai-guide', slugs)
        self.assertNotIn('django-guide', slugs)

    def test_blog_list_search_filter(self):
        response = self.client.get('/api/posts/?search=Django')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [p['slug'] for p in response.data['results']]
        self.assertIn('django-guide', slugs)
        self.assertNotIn('ai-guide', slugs)

    def test_blog_detail_published(self):
        response = self.client.get(f'/api/posts/{self.post_published.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Django Guide')
        self.assertIn('related_posts', response.data)

    def test_draft_post_not_publicly_accessible(self):
        # Anonymous user should get 404 for draft post
        response = self.client.get(f'/api/posts/{self.post_draft.slug}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_draft_post_accessible_by_author(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f'/api/posts/{self.post_draft.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Secret Draft')

    def test_categories_list_api(self):
        response = self.client.get('/api/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [c['slug'] for c in response.data]
        self.assertIn('tech', slugs)
        self.assertIn('ai', slugs)

    def test_category_detail_api(self):
        response = self.client.get('/api/categories/tech/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Tech')

    def test_category_posts_api(self):
        response = self.client.get('/api/categories/tech/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        slugs = [p['slug'] for p in response.data['results']]
        self.assertIn('django-guide', slugs)
        self.assertNotIn('secret-draft', slugs)
