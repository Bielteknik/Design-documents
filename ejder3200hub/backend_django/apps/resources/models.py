from django.db import models
from django.core.validators import EmailValidator
import uuid


class Role(models.TextChoices):
    """User roles in the system"""
    SUPERADMIN = 'Superadmin', 'Süper Admin'
    ADMIN = 'Admin', 'Admin'
    MANAGER = 'Manager', 'Yönetici'
    TEAMLEAD = 'TeamLead', 'Ekip Lideri'
    MEMBER = 'Member', 'Ekip Üyesi'


class Department(models.Model):
    """Department model for organizational structure"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Departman Adı')
    parent = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='children',
        verbose_name='Üst Departman'
    )
    manager = models.ForeignKey(
        'Resource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_departments',
        verbose_name='Departman Müdürü'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments'
        verbose_name = 'Departman'
        verbose_name_plural = 'Departmanlar'
        ordering = ['name']

    def __str__(self):
        return self.name


class Resource(models.Model):
    """Resource (User/Employee) model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='İsim')
    email = models.EmailField(
        unique=True, 
        validators=[EmailValidator()],
        verbose_name='E-posta'
    )
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.MEMBER,
        verbose_name='Rol'
    )
    department = models.CharField(
        max_length=255, 
        null=True, 
        blank=True,
        verbose_name='Departman'
    )
    phone = models.CharField(
        max_length=20, 
        null=True, 
        blank=True,
        verbose_name='Telefon'
    )
    start_date = models.CharField(
        max_length=50, 
        null=True, 
        blank=True,
        verbose_name='İşe Başlama Tarihi'
    )
    avatar = models.CharField(
        max_length=500, 
        null=True, 
        blank=True,
        verbose_name='Profil Fotoğrafı'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'resources'
        verbose_name = 'Kaynak'
        verbose_name_plural = 'Kaynaklar'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"

    @property
    def role_authority(self):
        """Return role authority level (lower number = higher authority)"""
        authority_map = {
            Role.SUPERADMIN: 1,
            Role.ADMIN: 2,
            Role.MANAGER: 3,
            Role.TEAMLEAD: 4,
            Role.MEMBER: 5,
        }
        return authority_map.get(self.role, 5)