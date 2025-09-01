from django.db import models
import uuid


class RsvpStatus(models.TextChoices):
    """RSVP status choices"""
    ACCEPTED = 'Accepted', 'Katılıyorum'
    DECLINED = 'Declined', 'Katılamıyorum'
    PENDING = 'Pending', 'Bekleniyor'


class Event(models.Model):
    """Event model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name='Etkinlik Başlığı')
    description = models.TextField(null=True, blank=True, verbose_name='Açıklama')
    start_time = models.CharField(max_length=50, verbose_name='Başlangıç Saati', db_column='startTime')
    end_time = models.CharField(max_length=50, verbose_name='Bitiş Saati', db_column='endTime')
    location = models.CharField(max_length=255, null=True, blank=True, verbose_name='Konum')
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='events',
        verbose_name='İlgili Proje',
        db_column='projectId'
    )
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