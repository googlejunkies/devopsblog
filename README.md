# DevOpsBlog — Full-Stack Blog Platform

A production-ready full-stack blog platform built with **Next.js (App Router, TypeScript, Tailwind CSS)** on the frontend, **Django REST Framework (DRF)** on the backend, and **PostgreSQL** as the primary relational database.

---

## Architecture Overview

```text
devopsblog/
├── frontend/                     # Next.js App Router Frontend
│   ├── app/                      # Pages: /, /blog, /blog/[slug], /category/[slug], /login, /register, /profile
│   ├── components/               # Header, Footer, BlogCard, BlogGrid, CategoryNavigation, etc.
│   ├── context/                  # AuthContext for state & session management
│   ├── lib/                      # API client & fetch utilities
│   ├── types/                    # TypeScript interfaces
│   ├── __tests__/                # Vitest & React Testing Library test suites
│   ├── Dockerfile                # Multi-stage production container
│   └── package.json
│
├── backend/                      # Django REST Framework Backend
│   ├── config/                   # Settings, WSGI/ASGI, Root URLs
│   ├── users/                    # Custom User model, token auth, profile
│   ├── categories/               # Category model, admin, endpoints
│   ├── blogs/                    # BlogPost model, admin, search/filtering, seed command
│   ├── manage.py                 # Django management script
│   ├── requirements.txt          # Python dependencies
│   └── Dockerfile                # Production-ready Python 3.12 container
│
├── docker-compose.yml            # Multi-container orchestration (db, backend, frontend)
├── .env.example                  # Environment configuration template
└── README.md
```

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Vitest
- **Backend**: Python 3.12, Django 5, Django REST Framework, django-cors-headers, Bleach (HTML sanitization)
- **Database**: PostgreSQL
- **Authentication**: Token-Based Authentication via DRF Token framework
- **Containerization**: Docker & Docker Compose

---

## Quick Start (with Docker Compose)

The fastest way to launch the entire stack:

```bash
# 1. Clone or navigate to the project directory
cd /home/aman/Dev/devops/devopsblog

# 2. Copy the sample environment file
cp .env.example .env

# 3. Build and start all services (PostgreSQL, Django Backend, Next.js Frontend)
docker compose up --build
```

Once running:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

---

## Local Development Setup (Without Docker)

### Prerequisites

- **Python**: 3.11+ (Python 3.12 recommended)
- **Node.js**: v20+ or v22+
- **PostgreSQL**: Installed and running locally
- **npm** or **pnpm**

---

### 1. Database Setup

Create the PostgreSQL database for the application:

```bash
psql -U postgres -c "CREATE DATABASE blog_db;"
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables in ../.env or backend/.env
# For local Unix socket peer authentication:
# POSTGRES_DB=blog_db
# POSTGRES_USER=your_linux_username
# POSTGRES_HOST=
# POSTGRES_PORT=5432

# Run migrations
python manage.py migrate

# Seed sample data (creates categories, 6 sample posts, and admin superuser)
python manage.py seed_data

# Start development server
python manage.py runserver 0.0.0.0:8000
```

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend

# Install npm packages
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Default Development Credentials

The `seed_data` command creates default credentials for local development:

| Role | Username | Email | Password |
|---|---|---|---|
| **Superuser / Admin** | `admin` | `admin@example.com` | `admin123` |
| **Author** | `sarah_writer` | `sarah@example.com` | `writer123` |

> [!WARNING]
> These credentials are for local development only. In production, configure strong passwords using `DJANGO_SUPERUSER_PASSWORD` in your environment variables.

To change the admin password at any time:
```bash
python manage.py changepassword admin
```

---

## Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `DEBUG` | Enable Django debug mode (`True` or `False`) | `True` |
| `SECRET_KEY` | Django cryptographic signing key | Dev insecure key |
| `ALLOWED_HOSTS` | Comma-separated allowed hostnames | `localhost,127.0.0.1,0.0.0.0` |
| `POSTGRES_DB` | PostgreSQL database name | `blog_db` |
| `POSTGRES_USER` | PostgreSQL user | `blog_user` (or local user) |
| `POSTGRES_PASSWORD` | PostgreSQL user password | `blog_password` |
| `POSTGRES_HOST` | Database host (`db` for docker, empty for socket) | `localhost` |
| `POSTGRES_PORT` | PostgreSQL port | `5432` |
| `DJANGO_SUPERUSER_USERNAME` | Default admin username for seed command | `admin` |
| `DJANGO_SUPERUSER_EMAIL` | Default admin email | `admin@example.com` |
| `DJANGO_SUPERUSER_PASSWORD` | Default admin password | `admin123` |
| `NEXT_PUBLIC_API_URL` | Frontend URL to backend REST API | `http://localhost:8000/api` |

---

## REST API Specification

### Authentication

- `POST /api/auth/register/`: Register a new user account (returns token and user profile)
- `POST /api/auth/login/`: Authenticate with username/email and password (returns token and user profile)
- `POST /api/auth/logout/`: Invalidate authentication token (requires `Authorization: Token <key>`)
- `GET /api/auth/me/`: Retrieve profile of currently authenticated user

### Blog Posts

- `GET /api/posts/`: List published blog posts (supports `page`, `page_size`, `category`, `search`)
- `GET /api/posts/<slug>/`: Retrieve blog post detail and related posts by slug (draft posts return 404 for anonymous users)

### Categories

- `GET /api/categories/`: List all categories with published post counts
- `GET /api/categories/<slug>/`: Retrieve single category detail
- `GET /api/categories/<slug>/posts/`: List paginated published posts for category

---

## Testing

### Backend Test Suite

Run unit and integration tests across users, blogs, and categories:

```bash
cd backend
python manage.py test users blogs
```

**Coverage includes**:
- User registration, duplicate validation, and password strength
- Login via username and email
- Token invalidation on logout
- Draft post isolation (public 404 enforcement)
- Author/staff draft preview access
- Category post filtering and search

### Frontend Test Suite

Run unit and component tests:

```bash
cd frontend
npm run test
```

**Coverage includes**:
- Blog card rendering, metadata formatting, and navigation links
- Login form validation and interactive submission
- Type safety validation with TypeScript (`npm run build`)
