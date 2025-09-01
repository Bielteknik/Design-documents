from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CommentViewSet, FeedbackViewSet, PurchaseRequestViewSet, InvoiceViewSet

router = DefaultRouter()
router.register(r'comments', CommentViewSet)
router.register(r'feedbacks', FeedbackViewSet)
router.register(r'purchase-requests', PurchaseRequestViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('', include(router.urls)),
]