# Deployment Guide

This guide provides comprehensive instructions for deploying the Django REST Framework e-commerce application to production environments.

## 🚀 Deployment Overview

The application consists of two main components:
- **Backend**: Django REST Framework API
- **Frontend**: React TypeScript application

## 🏗️ Backend Deployment

### Prerequisites
- Python 3.8+
- PostgreSQL (recommended for production)
- Nginx or Apache
- SSL certificate
- Domain name

### 1. Production Environment Setup

#### Environment Variables
Create a `.env` file for production:

```bash
SECRET_KEY=your-super-secret-production-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_production_db
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
```

#### Production Settings
Update `drf_course/settings.py`:

```python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key')
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')

DATABASES = {
    'default': {
        'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3'),
        'NAME': os.environ.get('DB_NAME', BASE_DIR / 'db.sqlite3'),
        'USER': os.environ.get('DB_USER', ''),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        'HOST': os.environ.get('DB_HOST', ''),
        'PORT': os.environ.get('DB_PORT', ''),
    }
}

STATIC_ROOT = os.environ.get('STATIC_ROOT', os.path.join(BASE_DIR, 'staticfiles'))
MEDIA_ROOT = os.environ.get('MEDIA_ROOT', os.path.join(BASE_DIR, 'media'))

if not DEBUG:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
```

### 2. Database Setup

#### PostgreSQL Installation
```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE your_production_db;
CREATE USER your_db_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE your_production_db TO your_db_user;
\q
```

#### Database Migration
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic
```

### 3. Gunicorn Configuration

#### Install Gunicorn
```bash
pip install gunicorn
```

#### Systemd Service
Create `/etc/systemd/system/django.service`:

```ini
[Unit]
Description=Django Gunicorn daemon
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/drf_course
Environment="PATH=/var/www/drf_course/venv/bin"
ExecStart=/var/www/drf_course/venv/bin/gunicorn --bind 127.0.0.1:8000 drf_course.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 4. Nginx Configuration

#### Nginx Configuration
Create `/etc/nginx/sites-available/drf_course`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /static/ {
        alias /var/www/static/;
        expires 1y;
    }

    location /media/ {
        alias /var/www/media/;
        expires 1y;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/drf_course /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

#### Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 🎨 Frontend Deployment

### 1. Build Production Version

#### Environment Configuration
Create `.env.production`:

```bash
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_APP_NAME=My Store
VITE_APP_VERSION=1.0.0
```

#### Build Process
```bash
cd my-store
npm run build
```

### 2. Deployment Options

#### Option A: Serve from Django (Recommended)
Copy the built files to Django's static directory:

```bash
cp -r my-store/dist/* /var/www/static/
```

#### Option B: Static Hosting
Deploy to static hosting services:

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

## 🐳 Docker Deployment

### Dockerfile for Backend

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client build-essential libpq-dev

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "drf_course.wsgi:application"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=your_production_db
      - POSTGRES_USER=your_db_user
      - POSTGRES_PASSWORD=your_secure_password

  web:
    build: .
    command: gunicorn --bind 0.0.0.0:8000 drf_course.wsgi:application
    volumes:
      - .:/app
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    ports:
      - "8000:8000"
    depends_on:
      - db

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

## ☁️ Cloud Deployment

### AWS Deployment

#### EC2 Instance Setup
```bash
# Launch EC2 instance and connect
ssh -i your-key.pem ubuntu@your-instance-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip postgresql postgresql-contrib nginx
```

#### RDS Database
```bash
# Create RDS instance via AWS Console
# Update Django settings with RDS endpoint
```

### Heroku Deployment

#### Heroku Setup
```bash
# Install Heroku CLI and login
heroku login
heroku create your-app-name
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main
```

## 🔧 Monitoring and Maintenance

### Health Checks

#### Django Health Check
```python
# Add to urls.py
def health_check(request):
    return HttpResponse("OK", status=200)

urlpatterns = [
    path('health/', health_check, name='health_check'),
]
```

### Backup Strategy

#### Database Backup
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="your_production_db"

mkdir -p $BACKUP_DIR
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Static Files Not Loading
```bash
python manage.py collectstatic --clear
sudo chown -R www-data:www-data /var/www/static/
```

#### 2. Database Connection Issues
```bash
python manage.py check --database default
sudo systemctl status postgresql
```

#### 3. Gunicorn Not Starting
```bash
sudo systemctl status django
sudo journalctl -u django -f
```

## 📚 Additional Resources

### Documentation
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [Nginx Configuration](https://nginx.org/en/docs/)

### Security
- [Django Security](https://docs.djangoproject.com/en/stable/topics/security/)
- [OWASP Guidelines](https://owasp.org/)
