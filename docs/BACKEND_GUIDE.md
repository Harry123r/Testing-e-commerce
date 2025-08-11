# Backend Development Guide

This document provides comprehensive information about the Django REST Framework backend application, including architecture, models, views, serializers, and development guidelines.

## 🏗️ Backend Architecture

The backend is built using Django 5.2 with Django REST Framework 3.16, providing a robust and scalable API for the e-commerce application.

### Technology Stack
- **Django 5.2**: Latest Django with modern Python features
- **Django REST Framework 3.16**: Powerful API framework
- **SQLite**: Development database (PostgreSQL ready for production)
- **Pillow**: Image processing and storage
- **Django Silk**: Performance profiling and monitoring
- **drf-spectacular**: Auto-generated API documentation
- **django-filter**: Advanced filtering capabilities
- **django-cors-headers**: Cross-origin resource sharing

## 📁 Project Structure

```
drf_course/
├── api/                    # Main Django application
│   ├── models.py          # Database models
│   ├── views.py           # API views and logic
│   ├── serializers.py     # Data serialization
│   ├── filters.py         # Custom filtering logic
│   ├── urls.py            # URL routing
│   └── admin.py           # Django admin configuration
├── drf_course/            # Django project settings
│   ├── settings.py        # Django configuration
│   ├── urls.py            # Main URL routing
│   └── wsgi.py            # WSGI application
├── media/                 # User-uploaded files
├── requirements.txt       # Python dependencies
└── manage.py             # Django management script
```

## 🗄️ Database Models

### User Model
Custom user model extending Django's AbstractUser.

```python
class User(AbstractUser):
    pass
```

### Product Model
Core model for managing product information and inventory.

```python
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)

    @property
    def in_stock(self):
        return self.stock > 0
```

### Order Model
Model for managing customer orders with status tracking.

```python
class Order(models.Model):
    class StatusChoices(models.TextChoices):
        PENDING = 'Pending'
        CONFIRMED = 'Confirmed'
        CANCELLED = 'Cancelled'

    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    products = models.ManyToManyField(Product, through="OrderItem", related_name='orders')
```

### OrderItem Model
Intermediate model for managing order-product relationships with quantities.

```python
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    @property
    def item_subtotal(self):
        return self.product.price * self.quantity
```

## 🔌 API Views

### ProductListCreateAPIView
Handles both listing and creation of products with advanced filtering.

```python
class ProductListCreateAPIView(generics.ListCreateAPIView):
    queryset = Product.objects.order_by('pk')
    serializer_class = ProductSerializer
    filterset_class = ProductFilter
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter, InStockFilterBackend]
    search_fields = ['name', 'description']
    ordering_filter = ['name', 'price', 'stock']
    pagination_class = LimitOffsetPagination

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
```

### OrderViewset
ModelViewSet for comprehensive order management.

```python
class OrderViewset(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related('items__product')
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = OrderFilter

    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_staff:
            return qs.filter(user=self.request.user)
        return qs
```

## 📝 Serializers

### ProductSerializer
Handles product data serialization and validation.

```python
class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'description', 'name', 'price', 'stock', 'image', 'image_url')
    
    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError('Product price must be greater than 0.')
        return value
```

### OrderSerializer
Complex serializer for order data with nested relationships.

```python
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField(method_name='total')

    def total(self, obj):
        return sum(order_item.item_subtotal for order_item in obj.items.all())

    class Meta:
        model = Order
        fields = ('order_id', 'created_at', 'user', 'status', 'items', 'total_price')
```

## 🔍 Filtering and Search

### Custom Filter Backends
Advanced filtering capabilities for enhanced API functionality.

```python
class InStockFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(stock__gt=0)

class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = Product
        fields = {
            "name": ["iexact", "icontains"],
            "price": ["exact", "lt", "gt", "range"]
        }
```

## 🔐 Authentication and Permissions

### Permission Classes
Role-based access control for different API endpoints.

```python
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny

# Dynamic permission assignment
def get_permissions(self):
    self.permission_classes = [AllowAny]
    if self.request.method == 'POST':
        self.permission_classes = [IsAdminUser]
    return super().get_permissions()
```

## 📊 Pagination

### LimitOffsetPagination
Configurable pagination for large datasets.

```python
pagination_class = LimitOffsetPagination
```

## 🧪 Testing

### Test Structure
Comprehensive testing for all API endpoints and business logic.

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test api
```

## 🔧 Configuration

### Django Settings
Key configuration options for the API.

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_FILTER_BACKENDS': ['django_filters.rest_framework.DjangoFilterBackend'],
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

## 🚀 Performance Optimization

### Database Optimization
- Use select_related and prefetch_related
- Add database indexes for frequently queried fields
- Implement caching strategies

### API Optimization
- Proper pagination for large datasets
- Efficient filtering backends
- Optimize serializer performance

## 🔒 Security Considerations

### Authentication Security
- Secure session configuration
- Strong password validation
- CSRF protection
- API rate limiting

### Data Security
- Comprehensive input validation
- Secure file upload handling
- HTTPS in production

## 📚 API Documentation

### drf-spectacular Integration
Automatic OpenAPI schema generation.

```python
SPECTACULAR_SETTINGS = {
    'TITLE': 'E-commerce API',
    'DESCRIPTION': 'Complete e-commerce API with product and order management',
    'VERSION': '1.0.0',
}
```

## 🐛 Debugging and Monitoring

### Django Silk
Performance profiling and monitoring.

```python
MIDDLEWARE = [
    'silk.middleware.SilkyMiddleware',
]
```

## 🔄 Deployment

### Production Settings
Configuration changes required for production deployment.

```python
DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'production_db',
        'USER': 'db_user',
        'PASSWORD': 'secure_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🤝 Contributing

### Development Workflow
1. Fork repository
2. Create feature branch
3. Follow Django coding standards
4. Write tests for new functionality
5. Update documentation
6. Submit pull request

### Code Standards
- Follow PEP 8 Python style guide
- Use Django conventions
- Add type hints where appropriate
- Document functions and classes
- Add inline comments for complex logic
