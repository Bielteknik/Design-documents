from django.db import models
from django.contrib.postgres.fields import ArrayField
import uuid


class ProjectStatus(models.TextChoices):
    """Project status choices"""
    ACTIVE = 'Active', 'Aktif'
    PLANNING = 'Planning', 'Planlama'
    COMPLETED = 'Completed', 'Tamamlandı'


class Priority(models.TextChoices):
    """Priority choices"""
    HIGH = 'High', 'Yüksek'
    MEDIUM = 'Medium', 'Orta'
    LOW = 'Low', 'Düşük'


class TaskStatus(models.TextChoices):
    """Task status choices"""
    TODO = 'ToDo', 'Yapılacak'
    IN_PROGRESS = 'InProgress', 'Devam Ediyor'
    DONE = 'Done', 'Tamamlandı'


class Project(models.Model):
    """Project model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Proje Adı')
    code = models.CharField(max_length=50, unique=True, verbose_name='Proje Kodu')
    status = models.CharField(
        max_length=20,
        choices=ProjectStatus.choices,
        default=ProjectStatus.PLANNING,
        verbose_name='Durum'
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        verbose_name='Öncelik'
    )
    start_date = models.CharField(max_length=50, verbose_name='Başlangıç Tarihi', db_column='startDate')
    end_date = models.CharField(max_length=50, verbose_name='Bitiş Tarihi', db_column='endDate')
    progress = models.IntegerField(default=0, verbose_name='İlerleme (%)')
    manager = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='managed_projects',
        verbose_name='Proje Müdürü',
        db_column='managerId'
    )
    team = ArrayField(
        models.CharField(max_length=36),
        default=list,
        blank=True,
        verbose_name='Takım Üyeleri'
    )
    budget = models.FloatField(verbose_name='Bütçe')
    color = models.CharField(max_length=20, verbose_name='Renk')
    files = ArrayField(
        models.CharField(max_length=500),
        default=list,
        blank=True,
        verbose_name='Dosyalar'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'projects'
        verbose_name = 'Proje'
        verbose_name_plural = 'Projeler'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} - {self.name}"


class Task(models.Model):
    """Task model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name='Görev Başlığı')
    description = models.TextField(null=True, blank=True, verbose_name='Açıklama')
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        default=TaskStatus.TODO,
        verbose_name='Durum'
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        default=Priority.MEDIUM,
        verbose_name='Öncelik'
    )
    assignee = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='assigned_tasks',
        verbose_name='Atanan Kişi',
        db_column='assigneeId'
    )
    reporter = models.ForeignKey(
        'resources.Resource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reported_tasks',
        verbose_name='Rapor Eden',
        db_column='reporterId'
    )
    project = models.ForeignKey(
        Project,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name='Proje',
        db_column='projectId'
    )
    start_date = models.CharField(max_length=50, null=True, blank=True, verbose_name='Başlangıç Tarihi', db_column='startDate')
    end_date = models.CharField(max_length=50, null=True, blank=True, verbose_name='Bitiş Tarihi', db_column='endDate')
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'tasks'
        verbose_name = 'Görev'
        verbose_name_plural = 'Görevler'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.assignee.name}"