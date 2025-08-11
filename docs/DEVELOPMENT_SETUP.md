# Development Setup Guide

This guide provides comprehensive instructions for setting up a local development environment for the Django REST Framework e-commerce project.

## 🚀 Prerequisites

### Required Software
- **Python 3.8+**: Latest Python version recommended
- **Node.js 16+**: For frontend development
- **Git**: Version control system
- **Code Editor**: VS Code, PyCharm, or your preferred editor
- **Database**: SQLite (default) or PostgreSQL
- **Virtual Environment**: Python virtual environment tool

### System Requirements
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 2GB free space
- **OS**: Windows, macOS, or Linux

## 🐍 Python Environment Setup

### 1. Python Installation

#### Windows
```bash
# Download from python.org or use winget
winget install Python.Python.3.11

# Verify installation
python --version
pip --version
```

#### macOS
```bash
# Using Homebrew
brew install python@3.11

# Verify installation
python3 --version
pip3 --version
```

#### Linux (Ubuntu/Debian)
```bash
# Update package list
sudo apt update

# Install Python
sudo apt install python3 python3-pip python3-venv

# Verify installation
python3 --version
pip3 --version
```

### 2. Virtual Environment Setup

#### Create Virtual Environment
```bash
# Navigate to project directory
cd drf_course

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Virtual Environment Management
```bash
# Install dependencies
pip install -r requirements.txt

# Deactivate when done
deactivate

# Reactivate later
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

## 🗄️ Database Setup

### 1. SQLite (Default)
SQLite is included with Python and requires no additional setup.

```bash
# Database will be created automatically
python manage.py migrate
```

### 2. PostgreSQL (Recommended for Development)

#### Installation

**Windows:**
```bash
# Download from postgresql.org or use winget
winget install PostgreSQL.PostgreSQL
```

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Database Configuration
```bash
# Create database and user
sudo -u postgres psql

CREATE DATABASE drf_course_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE drf_course_dev TO dev_user;
\q
```

#### Update Django Settings
```python
# drf_course/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'drf_course_dev',
        'USER': 'dev_user',
        'PASSWORD': 'dev_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🌐 Backend Development Setup

### 1. Django Project Setup

#### Install Dependencies
```bash
# Activate virtual environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install requirements
pip install -r requirements.txt
```

#### Database Migration
```bash
# Create initial migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

#### Development Server
```bash
# Run development server
python manage.py runserver

# Server will be available at http://127.0.0.1:8000/
# Admin interface at http://127.0.0.1:8000/admin/
```

### 2. Environment Configuration

#### Create .env File
```bash
# Create .env file in project root
touch .env

# Add development configuration
echo "DEBUG=True" >> .env
echo "SECRET_KEY=your-dev-secret-key" >> .env
echo "ALLOWED_HOSTS=localhost,127.0.0.1" >> .env
echo "CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173" >> .env
```

#### Install python-dotenv
```bash
pip install python-dotenv
```

#### Update Settings
```python
# drf_course/settings.py
from pathlib import Path
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Use environment variables
SECRET_KEY = os.getenv('SECRET_KEY', 'default-secret-key')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
```

### 3. Development Tools

#### Django Extensions
```bash
# Install Django extensions for development
pip install django-extensions

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ... existing apps
    'django_extensions',
]
```

#### Django Debug Toolbar
```bash
# Install debug toolbar
pip install django-debug-toolbar

# Add to INSTALLED_APPS and MIDDLEWARE
INSTALLED_APPS = [
    # ... existing apps
    'debug_toolbar',
]

MIDDLEWARE = [
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    # ... existing middleware
]

# Add to settings
INTERNAL_IPS = [
    '127.0.0.1',
]
```

#### IPython Shell
```bash
# Install IPython for better shell experience
pip install ipython

# Use Django shell with IPython
python manage.py shell_plus
```

## ⚛️ Frontend Development Setup

### 1. Node.js Setup

#### Install Node.js
```bash
# Verify Node.js installation
node --version
npm --version

# If not installed, download from nodejs.org
```

#### Install Dependencies
```bash
# Navigate to frontend directory
cd my-store

# Install dependencies
npm install
```

### 2. Development Server

#### Start Development Server
```bash
# Start development server
npm run dev

# Server will be available at http://localhost:5173/
```

#### Environment Configuration
```bash
# Create .env.local for local development
touch .env.local

# Add local configuration
echo "VITE_API_BASE_URL=http://localhost:8000/api" >> .env.local
echo "VITE_APP_NAME=My Store (Dev)" >> .env.local
```

### 3. Development Tools

#### ESLint Configuration
```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

#### TypeScript Configuration
```bash
# Check TypeScript compilation
npm run build

# Type checking
npx tsc --noEmit
```

## 🛠️ Development Workflow

### 1. Git Setup

#### Repository Setup
```bash
# Initialize git repository (if not already done)
git init

# Add remote origin
git remote add origin <your-repository-url>

# Create development branch
git checkout -b develop
```

#### Git Hooks (Optional)
```bash
# Install pre-commit hooks
pip install pre-commit

# Create .pre-commit-config.yaml
pre-commit install
```

### 2. Code Quality Tools

#### Python Code Quality
```bash
# Install code quality tools
pip install black flake8 isort mypy

# Format code with Black
black .

# Sort imports with isort
isort .

# Check code style with flake8
flake8 .

# Type checking with mypy
mypy .
```

#### JavaScript/TypeScript Code Quality
```bash
# Install additional tools
npm install -g prettier

# Format code with Prettier
npx prettier --write .

# Check code quality
npm run lint
```

### 3. Testing Setup

#### Backend Testing
```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test api

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

#### Frontend Testing
```bash
# Install testing libraries
npm install --save-dev @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🔧 Development Configuration

### 1. Django Development Settings

#### Development-specific Settings
```python
# drf_course/settings.py

if DEBUG:
    # Development-specific settings
    INSTALLED_APPS += [
        'debug_toolbar',
        'django_extensions',
    ]
    
    MIDDLEWARE += [
        'debug_toolbar.middleware.DebugToolbarMiddleware',
    ]
    
    # Development database
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
    
    # Development email backend
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    
    # Development logging
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'loggers': {
            'django': {
                'handlers': ['console'],
                'level': 'DEBUG',
            },
        },
    }
```

### 2. Frontend Development Configuration

#### Vite Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🧪 Testing and Debugging

### 1. Backend Testing

#### Test Configuration
```python
# Create tests.py in api app
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

class ProductAPITestCase(APITestCase):
    def setUp(self):
        # Create test data
        pass
    
    def test_product_list(self):
        # Test product listing
        url = reverse('product-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

#### Running Tests
```bash
# Run all tests
python manage.py test

# Run specific test file
python manage.py test api.tests.ProductAPITestCase

# Run with verbose output
python manage.py test -v 2

# Run tests in parallel
python manage.py test --parallel
```

### 2. Frontend Testing

#### Component Testing
```typescript
// src/components/__tests__/Products.test.tsx
import { render, screen } from '@testing-library/react'
import Products from '../Products'

describe('Products Component', () => {
  test('renders products list', () => {
    render(<Products />)
    expect(screen.getByText(/products/i)).toBeInTheDocument()
  })
})
```

#### API Testing
```typescript
// src/__tests__/api.test.ts
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('/api/products/', (req, res, ctx) => {
    return res(ctx.json({ results: [] }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

## 🐛 Debugging Tools

### 1. Django Debugging

#### Debug Toolbar
```python
# Add to settings.py
if DEBUG:
    INSTALLED_APPS += ['debug_toolbar']
    MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
    INTERNAL_IPS = ['127.0.0.1']
```

#### Logging Configuration
```python
# Add to settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'debug.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
        },
        'api': {
            'handlers': ['console', 'file'],
            'level': 'DEBUG',
        },
    },
}
```

### 2. Frontend Debugging

#### React DevTools
```bash
# Install React DevTools browser extension
# Available for Chrome, Firefox, and Edge
```

#### Console Logging
```typescript
// Add to components for debugging
console.log('Component state:', state)
console.log('API response:', response)

// Use React DevTools Profiler for performance analysis
```

## 📚 Development Resources

### 1. Documentation

#### Django Documentation
- [Django Tutorial](https://docs.djangoproject.com/en/stable/intro/tutorial01/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Models](https://docs.djangoproject.com/en/stable/topics/db/models/)

#### React Documentation
- [React Tutorial](https://react.dev/learn)
- [React Hooks](https://react.dev/reference/react)
- [TypeScript with React](https://www.typescriptlang.org/docs/handbook/react.html)

### 2. Development Tools

#### VS Code Extensions
- Python
- Django
- React Developer Tools
- TypeScript Importer
- Prettier
- ESLint

#### PyCharm/IntelliJ
- Django Support
- Database Tools
- REST Client
- JavaScript/TypeScript Support

### 3. Community Resources

#### Forums and Communities
- [Django Forum](https://forum.djangoproject.com/)
- [Stack Overflow](https://stackoverflow.com/)
- [Reddit r/django](https://www.reddit.com/r/django/)
- [React Community](https://reactjs.org/community/support.html)

## 🚨 Common Issues and Solutions

### 1. Backend Issues

#### Database Connection
```bash
# Check database connection
python manage.py check --database default

# Reset database
python manage.py flush
python manage.py migrate
```

#### Static Files
```bash
# Collect static files
python manage.py collectstatic

# Check static files configuration
python manage.py check --deploy
```

### 2. Frontend Issues

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

#### API Connection
```bash
# Check CORS configuration
# Verify API base URL in .env.local
# Check network tab in browser DevTools
```

## 🔄 Development Workflow Best Practices

### 1. Code Organization
- Follow Django and React conventions
- Use meaningful variable and function names
- Add docstrings and comments
- Keep functions small and focused

### 2. Git Workflow
- Create feature branches for new features
- Write descriptive commit messages
- Use conventional commit format
- Review code before merging

### 3. Testing Strategy
- Write tests for new functionality
- Maintain good test coverage
- Use descriptive test names
- Test both success and failure cases

### 4. Performance Considerations
- Monitor database queries
- Use Django Debug Toolbar
- Optimize React component rendering
- Profile performance bottlenecks

This development setup guide provides a comprehensive foundation for developers to work effectively on the Django REST Framework e-commerce project. Follow these guidelines to ensure a smooth development experience and maintain code quality throughout the project lifecycle.
