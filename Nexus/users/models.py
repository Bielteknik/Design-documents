# users/models.py

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)

# -----------------------------------------------------------------------------
# YETKİ (PERMISSION) MODELİ
# -----------------------------------------------------------------------------
class Permission(models.Model):
    """
    Sistemdeki atomik yetkileri tanımlar.
    Örnek: 'tasks.create', 'tasks.view_all', 'reporting.view'
    """
    name = models.CharField(
        max_length=255, 
        unique=True, 
        help_text="Yetkinin benzersiz adı (örn: tasks.create)"
    )
    description = models.CharField(
        max_length=255, 
        blank=True, 
        help_text="Bu yetkinin ne işe yaradığının açıklaması"
    )

    class Meta:
        verbose_name = "Yetki"
        verbose_name_plural = "Yetkiler"
        ordering = ['name']

    def __str__(self):
        return self.name

# -----------------------------------------------------------------------------
# ROL (ROLE) MODELİ
# -----------------------------------------------------------------------------
class Role(models.Model):
    """
    Kullanıcı gruplarını (rolleri) ve bu rollerin sahip olduğu yetkileri tanımlar.
    Örnek: 'Yönetici', 'Departman Müdürü', 'Saha Teknisyeni'
    """
    name = models.CharField(
        max_length=255, 
        unique=True, 
        help_text="Rolün adı (örn: Yönetici)"
    )
    permissions = models.ManyToManyField(
        Permission, 
        blank=True,
        verbose_name="Yetkiler"
    )

    class Meta:
        verbose_name = "Rol"
        verbose_name_plural = "Roller"
        ordering = ['name']

    def __str__(self):
        return self.name

# -----------------------------------------------------------------------------
# ÖZEL KULLANICI YÖNETİCİSİ (CUSTOM USER MANAGER)
# -----------------------------------------------------------------------------
class UserManager(BaseUserManager):
    """
    Django'nun standart kullanıcı oluşturma mantığını, email'i
    kullanıcı adı olarak kullanacak şekilde özelleştiren yönetici sınıfı.
    """
    def create_user(self, email, password=None, **extra_fields):
        """Yeni bir kullanıcı oluşturur ve kaydeder."""
        if not email:
            raise ValueError('Kullanıcıların bir email adresi olmalıdır.')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Yeni bir süper kullanıcı (superuser) oluşturur ve kaydeder."""
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        
        # Süper kullanıcıya tüm yetkileri olan bir "Super Admin" rolü ata (opsiyonel ama kullanışlı)
        admin_role, created = Role.objects.get_or_create(name='Super Admin')
        user.roles.add(admin_role)
        
        return user

# -----------------------------------------------------------------------------
# ÖZEL KULLANICI (USER) MODELİ
# -----------------------------------------------------------------------------
class User(AbstractBaseUser, PermissionsMixin):
    """
    Projemizin temel kullanıcı modeli. Django'nun standart User modeli yerine
    bu modeli kullanıyoruz.
    """
    email = models.EmailField(max_length=255, unique=True, verbose_name="Email Adresi")
    first_name = models.CharField(max_length=255, verbose_name="Ad")
    last_name = models.CharField(max_length=255, verbose_name="Soyad")
    
    is_active = models.BooleanField(default=True, verbose_name="Aktif mi?")
    is_staff = models.BooleanField(default=False, verbose_name="Admin Paneli Erişimi")

    # Rol ve Yetki sistemi için ilişki
    roles = models.ManyToManyField(
        Role, 
        blank=True,
        verbose_name="Roller"
    )

    # Django'nun bu modeli nasıl yöneteceğini belirtiyoruz
    objects = UserManager()

    # Kullanıcı adı olarak 'username' yerine 'email' alanını kullan
    USERNAME_FIELD = 'email'
    
    class Meta:
        verbose_name = "Kullanıcı"
        verbose_name_plural = "Kullanıcılar"

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """Kullanıcının tam adını döndüren bir property."""
        return f"{self.first_name} {self.last_name}"