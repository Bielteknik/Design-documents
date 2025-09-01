from django.db import models
from django.contrib.postgres.fields import ArrayField
import uuid


class EventType(models.TextChoices):
    """Event type choices"""
    APPOINTMENT = 'Appointment', 'Randevu'
    TASK = 'Task', 'Görev'
    MEETING = 'Meeting', 'Toplantı'
    EVENT = 'Event', 'Etkinlik'
    NOTE = 'Note', 'Not'


class RsvpStatus(models.TextChoices):
    """RSVP status choices"""
    ACCEPTED = 'Accepted', 'Katılıyorum'
    DECLINED = 'Declined', 'Katılamıyorum'
    PENDING = 'Pending', 'Bekleniyor'


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


class Event(models.Model):
    """Event model - aligned with frontend Event interface"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name='Etkinlik Başlığı')
    date = models.CharField(max_length=50, default='2025-01-01', verbose_name='Tarih')  # Frontend date field
    type = models.CharField(
        max_length=20,
        choices=EventType.choices,
        default=EventType.EVENT,
        verbose_name='Etkinlik Tipi'
    )
    description = models.TextField(null=True, blank=True, verbose_name='Açıklama')
    content = models.TextField(null=True, blank=True, verbose_name='İçerik')
    tags = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        verbose_name='Etiketler'
    )
    start_time = models.CharField(max_length=50, null=True, blank=True, verbose_name='Başlangıç Saati', db_column='startTime')
    end_time = models.CharField(max_length=50, null=True, blank=True, verbose_name='Bitiş Saati', db_column='endTime')
    location = models.CharField(max_length=255, null=True, blank=True, verbose_name='Konum')
    participants = ArrayField(
        models.CharField(max_length=36),
        default=list,
        blank=True,
        verbose_name='Katılımcılar'
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        null=True,
        blank=True,
        verbose_name='Öncelik'
    )
    reminder = models.CharField(max_length=255, null=True, blank=True, verbose_name='Hatırlatıcı')
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='events',
        verbose_name='İlgili Proje',
        db_column='projectId'
    )
    idea = models.ForeignKey(
        'ideas.Idea',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='events',
        verbose_name='İlgili Fikir',
        db_column='ideaId'
    )
    files = ArrayField(
        models.CharField(max_length=500),
        default=list,
        blank=True,
        verbose_name='Dosyalar'
    )
    assignee = models.ForeignKey(
        'resources.Resource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_events',
        verbose_name='Atanan Kişi',
        db_column='assigneeId'
    )
    status = models.CharField(
        max_length=20,
        choices=TaskStatus.choices,
        null=True,
        blank=True,
        verbose_name='Durum'
    )
    # Task-specific fields for calendar tasks
    reporter = models.ForeignKey(
        'resources.Resource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reported_events',
        verbose_name='Rapor Eden',
        db_column='reporterId'
    )
    category = models.CharField(max_length=255, null=True, blank=True, verbose_name='Kategori')
    estimated_hours = models.IntegerField(null=True, blank=True, verbose_name='Tahmini Süre', db_column='estimatedHours')
    start_date = models.CharField(max_length=50, null=True, blank=True, verbose_name='Başlangıç Tarihi', db_column='startDate')
    end_date = models.CharField(max_length=50, null=True, blank=True, verbose_name='Bitiş Tarihi', db_column='endDate')
    completion_date = models.CharField(max_length=50, null=True, blank=True, verbose_name='Tamamlanma Tarihi', db_column='completionDate')
    dependencies = ArrayField(
        models.CharField(max_length=36),
        default=list,
        blank=True,
        verbose_name='Bağımlılıklar'
    )
    progress = models.IntegerField(default=0, verbose_name='İlerleme (%)')
    spent_hours = models.IntegerField(null=True, blank=True, verbose_name='Harcanan Süre', db_column='spentHours')
    notes = models.TextField(null=True, blank=True, verbose_name='Notlar')
    
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'events'
        verbose_name = 'Etkinlik'
        verbose_name_plural = 'Etkinlikler'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class EventRsvp(models.Model):
    """Event RSVP model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='rsvps',
        verbose_name='Etkinlik',
        db_column='eventId'
    )
    resource = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='attended_events',
        verbose_name='Katılımcı',
        db_column='resourceId'
    )
    status = models.CharField(
        max_length=20,
        choices=RsvpStatus.choices,
        default=RsvpStatus.PENDING,
        verbose_name='Katılım Durumu'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'event_rsvps'
        verbose_name = 'Etkinlik Katılımı'
        verbose_name_plural = 'Etkinlik Katılımları'
        unique_together = ['event', 'resource']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.resource.name} -> {self.event.title} ({self.get_status_display()})"