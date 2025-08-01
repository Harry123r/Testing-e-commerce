from django.http import JsonResponse
from api.serializers import ProductSerializer, OrderSerializer, ProductInfoSerializer, OrderCreateSerializer, UserSerializer
from api.models import Product, Order,OrderItem, User

from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.db.models import Max

from rest_framework import generics
from rest_framework.views import APIView
from rest_framework import viewsets

from rest_framework.permissions import (
    IsAuthenticated,
    IsAdminUser,
    AllowAny
    )

from api.filters import ProductFilter, InStockFilterBackend, OrderFilter #from filters.py module

from rest_framework import filters, status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model, login
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination


# # function views
# @api_view(['GET'])
# def product_list(request):
#     products = Product.objects.all()
#     serializer = ProductSerializer(products, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# def product_view(request, pk):
#     product = get_object_or_404(Product,pk=pk)
#     serializer = ProductSerializer(product)
#     return Response(serializer.data)
#class based views

# @api_view(['GET'])
# def order_list(request):
#     orders = Order.objects.prefetch_related(
#     'items__product'
#     ).all()
#     serializer = OrderSerializer(orders, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# def product_info(request):
    # products = Product.objects.all()
    # serializer = ProductInfoSerializer({
    #     'products': products,
    #     'count': len(products),
    #     'max_price': products.aggregate(max_price=Max('price'))['max_price']
    # })
    # return Response(serializer.data)


class ProductListCreateAPIView(generics.ListCreateAPIView): # both GET and POST method
    queryset = Product.objects.order_by('pk')
    serializer_class = ProductSerializer

    # filterset_fields = ('name', 'price') # view field filter

    filterset_class = ProductFilter

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
        InStockFilterBackend,
        ] # override default filter
    
    search_fields = ['name','description']
    ordering_filter = ['name','price','stock']

    pagination_class = LimitOffsetPagination
    # pagination_class = PageNumberPagination
    # pagination_class.page_size = 2
    # pagination_class.page_query_param = 'pagenum' #custom name
    # pagination_class.page_size_query_param ='size'
    # pagination_class.max_page_size = 6

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method == 'POST':
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    




class ProductCreateAPIView(generics.CreateAPIView): # POST API method
    model = Product
    serializer_class = ProductSerializer

class ProductCreateAPIView(generics.ListAPIView): # GET API method
    model = Product
    serializer_class = ProductSerializer


class ProductDeatailAPIView(generics.RetrieveUpdateDestroyAPIView): 
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_url_kwarg = 'pk' # custom primary key

    def get_permissions(self):
        self.permission_classes = [AllowAny]
        if self.request.method in ['PUT','DELETE','PATCH']:
            self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    

class OrderViewset(viewsets.ModelViewSet):
    queryset = Order.objects.prefetch_related('items__product')
    serializer_class = OrderSerializer    
    permission_classes = [IsAuthenticated]
    pagination_class=None
    filterset_class = OrderFilter
    filter_backends = [DjangoFilterBackend]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_class(self): # to choose serializer
        #can also check If post.request
        if self.action == 'create':
            return OrderCreateSerializer
        return super().get_serializer_class()
    
    def get_queryset(self):
        qs = super().get_queryset()
        if not self.request.user.is_staff: #not admin then
            return qs.filter(user=self.request.user)
        return qs



#class OrderListAPIView(generics.ListAPIView):
#     queryset = Order.objects.prefetch_related('items__product')
#     serializer_class = OrderSerializer

# class UserOrderListAPIView(generics.ListAPIView):
#     queryset = Order.objects.prefetch_related('items__product')
#     serializer_class = OrderSerializer
#     permission_classes = [IsAuthenticated] # permisson checks to disable endpoint during dynamical filetering

#     def get_queryset(self): # dynamically filerting use this method
#         qs = super().get_queryset()  # all orders Model.objects.all()
#         return qs.filter(user=self.request.user)  # only orders of logged-in user



class ProductInfoAPIVIew(APIView): # not binded to model # mostly good for returing data like end point
    def get(self,request):
        products = Product.objects.all()
        serializer = ProductInfoSerializer({
            'products': products,
            'count': len(products),
            'max_price': products.aggregate(max_price=Max('price'))['max_price']
        })
        return Response(serializer.data)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User created Successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.check_password(password):
            return Response({'message': 'Logged in Successfully', 'username': user.username}, status=status.HTTP_200_OK)
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

class ProductCreateAPIView(generics.CreateAPIView):
    model = Product
    serializer_class = ProductSerializer

    def get_permissions(self):
        self.permission_classes = [IsAdminUser]
        return super().get_permissions()
    

class AdminLoginAPIView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        if user.check_password(password):
            if user.is_staff or user.is_superuser:
                login(request, user)
                return Response({'message': 'Admin login successful', 'is_admin': True}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Not an admin user'}, status=status.HTTP_403_FORBIDDEN)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        user = request.user
        if user.is_authenticated and (user.is_staff or user.is_superuser):
            return Response({'is_admin': True})
        return Response({'is_admin': False}, status=status.HTTP_403_FORBIDDEN)


class AdminRegisterAPIView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.is_staff = True
            user.is_superuser = True
            user.save()
            login(request, user)
            return Response({
                'message': 'Admin registered successfully',
                'is_admin': True,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    