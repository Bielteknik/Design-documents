# operations/models.py
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class Department(models.Model):
    name = models.CharField(max_length=255, unique=True)
    # parent = models.ForeignKey('self', ... hiyerarşi için)
    def __str__(self):
        return self.name

class Task(models.Model):
    # Enum benzeri yapılar için Django'nun TextChoices'ını kullanıyoruz
    class Status(models.TextChoices):
        NEW = 'NEW', 'Yeni'
        ASSIGNED = 'ASSIGNED', 'Atandı'
        IN_PROGRESS = 'IN_PROGRESS', 'Devam Ediyor'
        COMPLETED = 'COMPLETED', 'Tamamlandı'
        CANCELLED = 'CANCELLED', 'İptal Edildi'

    class Priority(models.TextChoices):
        LOW = 'LOW', 'Düşük'
        NORMAL = 'NORMAL', 'Normal'
        HIGH = 'HIGH', 'Yüksek'
        URGENT = 'URGENT', 'Acil'

    title = models.CharField(max_length=255, verbose_name="Başlık")
    description = models.TextField(blank=True, null=True, verbose_name="Açıklama")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.NORMAL)
    
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.PROTECT, # Görevi oluşturan silinemez
        related_name='created_tasks'
    )
    assignee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL, # Atanan kişi sistemden ayrılırsa görev boşa düşsün
        null=True, blank=True,
        related_name='assigned_tasks'
    )
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True, verbose_name="Son Teslim Tarihi")

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']

class TaskComment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at'] # Yorumlar eskiden yeniye sıralansın

    def __str__(self):
        return f'Comment by {self.author} on {self.task.title}'
# Dosyaların görev bazında klasörlenmesi için bir yardımcı fonksiyon
def task_attachment_path(instance, filename):
    return f'tasks/{instance.task.id}/attachments/{filename}'

class TaskAttachment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='attachments')
    uploader = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to=task_attachment_path)
    description = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'File for {self.task.title} uploaded by {self.uploader}'

@receiver(post_save, sender=TaskComment)
def comment_post_save(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        group_name = f'task_{instance.task.id}'
        async_to_sync(channel_layer.group_send)(
            group_name,
            {
                'type': 'task.update', # consumer'daki metodun adı
                'message': f'Yeni bir yorum eklendi: "{instance.content[:30]}..."'
            }
        )

