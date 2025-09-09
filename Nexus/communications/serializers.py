# communications/serializers.py (Yeni dosya)
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True) # UserSerializer'ı import etmeliyiz
    # content_object'i daha anlamlı hale getiren bir alan
    target = serializers.StringRelatedField(source='content_object', read_only=True)
    
    class Meta:
        model = Notification
        fields = ['id', 'actor', 'verb', 'target', 'is_read', 'timestamp', 'object_id', 'content_type']

# communications/views.py (Yeni dosya)
from rest_framework import viewsets, mixins
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Sadece giriş yapmış kullanıcının bildirimlerini listele
        return self.request.user.notifications.all()

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        request.user.notifications.update(is_read=True)
        return Response(status=status.HTTP_204_NO_CONTENT)