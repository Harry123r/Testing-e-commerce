from django.urls import path 
from . import views
from rest_framework.routers import DefaultRouter
from .views import AdminLoginAPIView, AdminRegisterAPIView

urlpatterns = [
    path('products/',views.ProductListCreateAPIView.as_view()),
    path('products/<int:pk>',views.ProductDeatailAPIView.as_view()),
    path('products/info',views.ProductInfoAPIVIew.as_view()),
    path('register/', views.RegisterAPIView.as_view()),
    path('login/', views.LoginAPIView.as_view()),
    path('admin-login/', AdminLoginAPIView.as_view()),
    path('admin-register/', AdminRegisterAPIView.as_view()),
]

router =DefaultRouter()
router.register('order',views.OrderViewset)
urlpatterns += router.urls