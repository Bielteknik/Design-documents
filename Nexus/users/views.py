from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserSerializer

class ManageUserView(generics.RetrieveUpdateAPIView):
    """ Giriş yapmış kullanıcının bilgilerini yönetir. """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] # Bu endpoint'e sadece giriş yapmış kullanıcılar erişebilir

    def get_object(self):
        """ Sadece isteği yapan kullanıcının bilgilerini döndürür. """
        return self.request.user

class UserListView(generics.ListAPIView):
    """ Tüm kullanıcıları listelemek için basit bir view. """
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]