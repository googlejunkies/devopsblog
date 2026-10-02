import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from categories.models import Category
from blogs.models import BlogPost

User = get_user_model()

class Command(BaseCommand):
    help = 'Seeds initial development data including categories, sample blog posts, and development superuser'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing posts and categories before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING("Clearing existing posts and categories..."))
            BlogPost.objects.all().delete()
            Category.objects.all().delete()

        # 1. Superuser
        admin_username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
        admin_email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        admin_password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123')

        admin_user, created = User.objects.get_or_create(
            username=admin_username,
            defaults={
                'email': admin_email,
                'first_name': 'Admin',
                'last_name': 'User',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password(admin_password)
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f"Superuser '{admin_username}' created."))
        else:
            self.stdout.write(f"Superuser '{admin_username}' already exists.")

        # 2. Author User
        author_user, created = User.objects.get_or_create(
            username='sarah_writer',
            defaults={
                'email': 'sarah@example.com',
                'first_name': 'Sarah',
                'last_name': 'Connor',
                'is_staff': False,
            }
        )
        if created:
            author_user.set_password('writer123')
            author_user.save()
            self.stdout.write(self.style.SUCCESS("Author user 'sarah_writer' created."))

        # 3. Categories
        categories_data = [
            {
                'name': 'Technology',
                'slug': 'technology',
                'description': 'Latest insights into tech trends, computing architectures, and software engineering.'
            },
            {
                'name': 'Programming',
                'slug': 'programming',
                'description': 'Practical guides, patterns, and deep dives into Python, TypeScript, and modern stacks.'
            },
            {
                'name': 'AI & Machine Learning',
                'slug': 'ai',
                'description': 'Exploring LLMs, autonomous agents, neural networks, and AI engineering in practice.'
            },
            {
                'name': 'DevOps & Cloud',
                'slug': 'devops',
                'description': 'Continuous delivery, container orchestration, Docker, Kubernetes, and reliable infra.'
            },
            {
                'name': 'Web Development',
                'slug': 'web-development',
                'description': 'Modern web frameworks, Next.js, Django, responsive UI, and state management.'
            }
        ]

        cat_map = {}
        for c in categories_data:
            cat, created = Category.objects.get_or_create(
                slug=c['slug'],
                defaults={'name': c['name'], 'description': c['description']}
            )
            cat_map[c['slug']] = cat
            status_text = "created" if created else "exists"
            self.stdout.write(f"Category '{cat.name}' {status_text}.")

        # 4. Blog Posts
        now = timezone.now()
        posts_data = [
            {
                'title': 'Building Scalable Full-Stack Web Applications with Next.js and Django',
                'slug': 'building-scalable-full-stack-web-applications',
                'excerpt': 'Discover how to architect clean, decoupled web applications using Next.js App Router for frontend speed and Django REST Framework for bulletproof backend logic.',
                'content': '''<p>Building modern web applications requires balancing rapid developer velocity with long-term maintainability and high runtime performance. By pairing <strong>Next.js (App Router)</strong> on the client side with <strong>Django REST Framework (DRF)</strong> on the backend, teams get the best of both ecosystems.</p>

<h2>Why Next.js + Django?</h2>
<p>Django provides batteries-included data modeling, powerful migrations, built-in admin dashboards, and robust authentication primitives. Next.js complements this by offering high-performance server components, instant client-side routing, and top-tier SEO rendering.</p>

<h3>Key Architectural Principles</h3>
<ul>
  <li><strong>Stateless REST Endpoints:</strong> Keep API contracts clean, versioned, and documented.</li>
  <li><strong>Token-Based Authentication:</strong> Secure sessions cleanly across separate domains without cookie fragility.</li>
  <li><strong>Optimistic UI Updates:</strong> Render state instantly on the frontend while validating asynchronously against the backend.</li>
</ul>

<p>When properly architected, your frontend and backend repositories can be deployed and scaled independently with zero friction.</p>''',
                'featured_image_url': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
                'category': cat_map['web-development'],
                'author': admin_user,
                'status': 'PUBLISHED',
                'published_at': now - timedelta(days=10),
            },
            {
                'title': 'Mastering PostgreSQL: Query Optimization and Indexing Strategies',
                'slug': 'mastering-postgresql-query-optimization',
                'excerpt': 'Learn how to analyze query execution plans with EXPLAIN ANALYZE and design effective B-tree and GIN indexes for production workloads.',
                'content': '''<p>PostgreSQL is the gold standard of relational databases. However, as dataset sizes grow from thousands of rows to millions, query latency can degrade without thoughtful indexing and query structuring.</p>

<h2>Understanding EXPLAIN ANALYZE</h2>
<p>Before optimizing any query, you must inspect how the PostgreSQL query planner evaluates your SQL statement. <code>EXPLAIN (ANALYZE, BUFFERS)</code> provides real execution timings along with memory and disk buffer hits.</p>

<pre><code>EXPLAIN ANALYZE
SELECT id, title, published_at
FROM blogs_blogpost
WHERE status = 'PUBLISHED'
ORDER BY published_at DESC;</code></pre>

<h2>Choosing the Right Index Type</h2>
<p>PostgreSQL offers several index algorithms:</p>
<ul>
  <li><strong>B-Tree:</strong> The default and best choice for equality and range queries.</li>
  <li><strong>GIN (Generalized Inverted Index):</strong> Essential for full-text search and JSONB containment operators.</li>
  <li><strong>Partial Indexes:</strong> Ideal for filtering on common subsets, such as indexing only <code>status = 'PUBLISHED'</code> rows.</li>
</ul>''',
                'featured_image_url': 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1200&q=80',
                'category': cat_map['programming'],
                'author': author_user,
                'status': 'PUBLISHED',
                'published_at': now - timedelta(days=7),
            },
            {
                'title': 'Autonomous AI Agents: From Prompt Engineering to Workflow Orchestration',
                'slug': 'autonomous-ai-agents-workflow-orchestration',
                'excerpt': 'Explore how autonomous agent frameworks coordinate multi-step workflows, tool calls, and structured outputs to tackle real software engineering challenges.',
                'content': '''<p>The progression from simple conversational prompting to autonomous, multi-turn AI agents represents a fundamental paradigm shift in software development.</p>

<h2>The Anatomy of an Agent Loop</h2>
<p>An effective agent operates within a disciplined execution cycle:</p>
<ol>
  <li><strong>Perception:</strong> Ingesting current workspace state, file trees, and feedback.</li>
  <li><strong>Reasoning:</strong> Evaluating alternatives and formulating verifiable hypotheses.</li>
  <li><strong>Action:</strong> Executing precise tool calls (file edits, terminal commands, test runners).</li>
  <li><strong>Verification:</strong> Inspecting command outputs, logs, and linters to validate success.</li>
</ol>

<p>When combined with deterministic test suites, agents can reliably build complete applications, refactor complex legacy components, and resolve regressions autonomously.</p>''',
                'featured_image_url': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
                'category': cat_map['ai'],
                'author': admin_user,
                'status': 'PUBLISHED',
                'published_at': now - timedelta(days=4),
            },
            {
                'title': 'Production Docker Compose: Best Practices for Microservices and Databases',
                'slug': 'production-docker-compose-best-practices',
                'excerpt': 'A comprehensive guide to writing clean, reproducible Docker Compose setups featuring multi-stage builds, healthchecks, and non-root users.',
                'content': '''<p>Docker Compose simplifies multi-container orchestration during development and staging. However, poor configuration often causes flaky container startup order, bloated image sizes, and security risks.</p>

<h2>Key Best Practices</h2>
<ul>
  <li><strong>Multi-stage Docker builds:</strong> Keep build-time dependencies out of the final runtime image.</li>
  <li><strong>Proper healthchecks:</strong> Ensure dependent services like databases are fully ready before starting API services using <code>depends_on</code> conditions.</li>
  <li><strong>Named volumes for persistent data:</strong> Prevent accidental data loss during container recreation.</li>
  <li><strong>Non-root execution:</strong> Never run web servers as root inside containers.</li>
</ul>

<pre><code>services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U blog_user -d blog_db"]
      interval: 5s
      timeout: 5s
      retries: 5</code></pre>''',
                'featured_image_url': 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1200&q=80',
                'category': cat_map['devops'],
                'author': author_user,
                'status': 'PUBLISHED',
                'published_at': now - timedelta(days=2),
            },
            {
                'title': 'Designing Resilient REST APIs with Django REST Framework',
                'slug': 'designing-resilient-rest-apis-with-drf',
                'excerpt': 'Best practices for serialization, validation, filtering, pagination, and error responses in production Django REST Framework APIs.',
                'content': '''<p>Django REST Framework remains one of the most productive frameworks for building web APIs. Following standard conventions guarantees predictable behavior for frontend consumers.</p>

<h2>Essential Guidelines</h2>
<p>When designing APIs, always adhere to:</p>
<ul>
  <li><strong>Standard HTTP Status Codes:</strong> 201 for Created, 204 for No Content, 400 for Validation Errors, 401 for Unauthorized, 403 for Forbidden, and 404 for Not Found.</li>
  <li><strong>Structured Error Payloads:</strong> Avoid plain text errors; always return JSON dicts mapping field names to clear error strings.</li>
  <li><strong>Pagination:</strong> Never return unpaginated lists of records from large database tables.</li>
</ul>''',
                'featured_image_url': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                'category': cat_map['technology'],
                'author': admin_user,
                'status': 'PUBLISHED',
                'published_at': now - timedelta(hours=12),
            },
            {
                'title': 'Internal Architecture Notes: Next-Gen Caching Strategy (Draft)',
                'slug': 'internal-caching-strategy-notes',
                'excerpt': 'Unpublished draft testing post visibility and security permissions.',
                'content': '''<p>This post is currently in <strong>DRAFT</strong> status. It must NOT be visible to public unauthenticated users. Only authorized staff and authors may preview this document.</p>''',
                'featured_image_url': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
                'category': cat_map['technology'],
                'author': admin_user,
                'status': 'DRAFT',
                'published_at': None,
            },
        ]

        for p in posts_data:
            post, created = BlogPost.objects.get_or_create(
                slug=p['slug'],
                defaults=p
            )
            status_text = "created" if created else "exists"
            self.stdout.write(f"Blog post '{post.title[:40]}...' [{post.status}] {status_text}.")

        self.stdout.write(self.style.SUCCESS("Successfully seeded development data!"))
