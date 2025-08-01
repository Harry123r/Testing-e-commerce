from django.contrib import admin
from api.models import Order,OrderItem,User,Product

class OrderItemInline(admin.TabularInline):
    model = OrderItem

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock')
    search_fields = ('name', 'description')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ('order_id', 'user', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('order_id', 'user__username')

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'item_subtotal')
    list_filter = ('order__status',)
    search_fields = ('order__order_id', 'product__name')

admin.site.register(User)