# Documentation Index

Welcome to the comprehensive documentation for the Django REST Framework E-commerce project. This documentation provides everything you need to understand, develop, deploy, and maintain the application.

## 📚 Documentation Overview

This project is a full-stack e-commerce solution built with Django REST Framework backend and React TypeScript frontend. The documentation is organized into several sections to help developers, administrators, and users understand and work with the system effectively.

## 🗂️ Documentation Structure

### 📖 Main Documentation
- **[README.md](../README.md)** - Project overview, features, and quick start guide
- **[API Reference](API_REFERENCE.md)** - Complete API documentation with examples
- **[Frontend Guide](FRONTEND_GUIDE.md)** - React TypeScript frontend documentation
- **[Backend Guide](BACKEND_GUIDE.md)** - Django REST Framework backend documentation
- **[Development Setup](DEVELOPMENT_SETUP.md)** - Local development environment setup
- **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production deployment instructions

## 🚀 Quick Navigation

### For New Users
- Start with the [main README](../README.md) for project overview
- Review [API Reference](API_REFERENCE.md) to understand available endpoints
- Check [Frontend Guide](FRONTEND_GUIDE.md) for user interface features

### For Developers
- Follow [Development Setup](DEVELOPMENT_SETUP.md) to set up your local environment
- Read [Backend Guide](BACKEND_GUIDE.md) for Django development details
- Review [Frontend Guide](FRONTEND_GUIDE.md) for React development information

### For DevOps/Deployment
- Use [Deployment Guide](DEPLOYMENT_GUIDE.md) for production deployment
- Review [Backend Guide](BACKEND_GUIDE.md) for server configuration
- Check [Frontend Guide](FRONTEND_GUIDE.md) for build and deployment options

## 🏗️ Project Architecture

### Backend (Django REST Framework)
- **Framework**: Django 5.2 + Django REST Framework 3.16
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Authentication**: Custom user model with session-based auth
- **API Documentation**: Auto-generated with drf-spectacular
- **Performance**: Django Silk for profiling

### Frontend (React TypeScript)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **UI Framework**: Bootstrap 5
- **Routing**: React Router

## 🔧 Key Features

### Backend Features
- User authentication and authorization
- Product management with image support
- Order processing and status tracking
- Advanced filtering and search capabilities
- RESTful API with comprehensive endpoints
- Admin interface for content management

### Frontend Features
- Responsive product catalog
- Shopping cart functionality
- User authentication forms
- Admin dashboard
- Order management interface
- Modern, mobile-friendly design

## 📋 Prerequisites

### Development Requirements
- **Python**: 3.8+ (3.11+ recommended)
- **Node.js**: 16+ (18+ recommended)
- **Database**: SQLite or PostgreSQL
- **Git**: Version control system

### Production Requirements
- **Web Server**: Nginx or Apache
- **WSGI Server**: Gunicorn
- **Database**: PostgreSQL (recommended)
- **SSL Certificate**: Let's Encrypt or commercial
- **Domain Name**: For production deployment

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone <repository-url>
cd drf_course
```

### 2. Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd my-store

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🌐 API Endpoints

### Authentication
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/admin-login/` - Admin authentication

### Products
- `GET /api/products/` - List all products
- `POST /api/products/` - Create product (Admin)
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product (Admin)

### Orders
- `GET /api/order/` - List orders
- `POST /api/order/` - Create new order
- `GET /api/order/{id}/` - Get order details

## 🔍 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/new-feature
```

### 2. Testing
```bash
# Backend tests
python manage.py test

# Frontend tests
npm test

# Run linting
npm run lint
```

### 3. Code Quality
```bash
# Python formatting
black .
isort .
flake8 .

# TypeScript checking
npx tsc --noEmit
```

## 🚀 Deployment Options

### 1. Traditional Server
- **Backend**: Django + Gunicorn + Nginx
- **Database**: PostgreSQL
- **Static Files**: Nginx or CDN
- **SSL**: Let's Encrypt

### 2. Container Deployment
- **Docker**: Multi-container setup
- **Docker Compose**: Local and production
- **Environment**: Configurable via environment variables

### 3. Cloud Platforms
- **AWS**: EC2 + RDS + S3
- **Heroku**: Platform as a Service
- **DigitalOcean**: App Platform
- **Google Cloud**: App Engine

## 🔧 Configuration

### Environment Variables
```bash
# Django Settings
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password

# Frontend
VITE_API_BASE_URL=https://yourdomain.com/api
```

### Django Settings
- **Development**: Debug mode, SQLite database
- **Production**: Production settings, PostgreSQL, SSL
- **Testing**: Test database configuration

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Model, view, and serializer tests
- **Integration Tests**: API endpoint testing
- **Test Coverage**: Aim for 80%+ coverage

### Frontend Testing
- **Component Tests**: React component testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User flow testing

## 📊 Monitoring and Maintenance

### Performance Monitoring
- **Django Silk**: Request profiling
- **Database Queries**: Query optimization
- **Frontend Performance**: React DevTools Profiler

### Health Checks
- **API Health**: `/health/` endpoint
- **Database**: Connection monitoring
- **Frontend**: Build status and errors

### Backup Strategy
- **Database**: Regular PostgreSQL backups
- **Media Files**: File system backups
- **Code**: Git repository backups

## 🤝 Contributing

### Development Guidelines
1. Follow Django and React best practices
2. Write comprehensive tests
3. Update documentation
4. Use conventional commit messages
5. Create descriptive pull requests

### Code Standards
- **Python**: PEP 8, Black formatting
- **JavaScript/TypeScript**: ESLint, Prettier
- **Git**: Conventional commits
- **Documentation**: Markdown format

## 🆘 Support and Resources

### Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community
- [Django Forum](https://forum.djangoproject.com/)
- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Issues](https://github.com/your-repo/issues)

### Tools and Extensions
- **VS Code**: Python, Django, React extensions
- **PyCharm**: Django support and database tools
- **Browser DevTools**: React DevTools, Network monitoring

## 📝 Documentation Maintenance

### Updating Documentation
- Keep documentation in sync with code changes
- Update examples when API changes
- Add new sections for new features
- Review and update deployment guides

### Documentation Standards
- Use clear, concise language
- Include code examples
- Provide step-by-step instructions
- Use consistent formatting and structure

## 🔮 Future Enhancements

### Planned Features
- **PWA Support**: Progressive web app capabilities
- **Real-time Updates**: WebSocket integration
- **Advanced Search**: Elasticsearch integration
- **Payment Integration**: Stripe/PayPal support
- **Mobile App**: React Native application

### Performance Improvements
- **Caching**: Redis integration
- **CDN**: Content delivery network
- **Image Optimization**: WebP format support
- **Bundle Optimization**: Code splitting and lazy loading

---

This documentation is maintained by the development team and should be updated regularly to reflect the current state of the project. For questions or suggestions, please create an issue in the project repository or contact the development team.

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team
