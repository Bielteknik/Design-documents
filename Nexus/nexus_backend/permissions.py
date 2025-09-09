# nexus_backend/permissions.py (Proje kökünde yeni bir dosya)
from rest_framework.permissions import BasePermission

class HasPermission(BasePermission):
    """
    Kullanıcının belirli bir yetkiye sahip olup olmadığını kontrol eder.
    Kullanımı: permission_classes = [HasPermission(required_permissions=['tasks.view_all'])]
    """
    def __init__(self, required_permissions=None):
        self.required_permissions = required_permissions or []

    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        
        # Kullanıcının rollerine bağlı tüm yetkileri bir sette toplayalım
        user_permissions = set()
        for role in user.roles.all():
            for perm in role.permissions.all():
                user_permissions.add(perm.name)
        
        # Gerekli tüm yetkilerin kullanıcıda olup olmadığını kontrol et
        return all(perm in user_permissions for perm in self.required_permissions)

class IsTaskOwnerOrAdmin(BasePermission):
    """ Sadece görevin sahibi veya yöneticinin işlem yapabilmesini sağlar. """
    def has_object_permission(self, request, view, obj):
        # Yöneticiler her zaman yetkilidir (yönetici rolünü kontrol et)
        if request.user.roles.filter(name='Yönetici').exists():
            return True
        # Görevi oluşturan veya görevin atandığı kişi ise yetkilidir
        return obj.creator == request.user or obj.assignee == request.user