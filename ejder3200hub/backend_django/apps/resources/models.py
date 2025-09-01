from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import EmailValidator
import uuid


class Role(models.TextChoices):
    """User roles in the system"""
    SUPERADMIN = 'Superadmin', 'Süper Admin'
    ADMIN = 'Admin', 'Admin'
    MANAGER = 'Manager', 'Yönetici'
    TEAMLEAD = 'TeamLead', 'Ekip Lideri'
    MEMBER = 'Member', 'Ekip Üyesi'


class EmploymentType(models.TextChoices):
    """Employment type choices"""
    FULL_TIME = 'FullTime', 'Tam Zamanlı'
    PART_TIME = 'PartTime', 'Yarı Zamanlı'
    CONTRACTOR = 'Contractor', 'Sözleşmeli'
    INTERN = 'Intern', 'Stajyer'


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
        verbose_name='Üst Departman',
        db_column='parentId'
    )
    manager = models.ForeignKey(
        'Resource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_departments',
        verbose_name='Departman Müdürü',
        db_column='managerId'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'departments'
        verbose_name = 'Departman'
        verbose_name_plural = 'Departmanlar'
        ordering = ['name']

    def __str__(self):
        return self.name


class Resource(models.Model):
    """Resource (User/Employee) model - aligned with frontend Resource interface"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='İsim')
    initials = models.CharField(max_length=10, default='', verbose_name='Baş Harfler')
    position = models.CharField(max_length=255, default='', verbose_name='Pozisyon')
    department_id = models.CharField(
        max_length=36, 
        default='',
        verbose_name='Departman ID',
        db_column='departmentId'
    )
    email = models.EmailField(
        unique=True, 
        validators=[EmailValidator()],
        null=True,
        blank=True,
        verbose_name='E-posta'
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
        verbose_name='İşe Başlama Tarihi',
        db_column='startDate'
    )
    employment_type = models.CharField(
        max_length=20,
        choices=EmploymentType.choices,
        null=True,
        blank=True,
        verbose_name='İstihdam Tipi',
        db_column='employmentType'
    )
    skills = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        verbose_name='Yetenekler'
    )
    weekly_hours = models.IntegerField(default=40, verbose_name='Haftalık Çalışma Saati', db_column='weeklyHours')
    current_load = models.IntegerField(default=0, verbose_name='Mevcut Yük (%)', db_column='currentLoad')
    manager_id = models.CharField(
        max_length=36,
        null=True,
        blank=True,
        verbose_name='Yönetici ID',
        db_column='managerId'
    )
    bio = models.TextField(null=True, blank=True, verbose_name='Biyografi')
    earned_badges = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        verbose_name='Kazanılan Rozetler',
        db_column='earnedBadges'
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
    avatar = models.CharField(
        max_length=500, 
        null=True, 
        blank=True,
        verbose_name='Profil Fotoğrafı'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

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