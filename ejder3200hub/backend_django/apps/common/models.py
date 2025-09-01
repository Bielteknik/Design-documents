from django.db import models
import uuid


class FeedbackCategory(models.TextChoices):
    """Feedback category choices"""
    BUG_REPORT = 'BugReport', 'Hata Bildirimi'
    FEATURE_REQUEST = 'FeatureRequest', 'Özellik Talebi'
    GENERAL = 'General', 'Genel Yorum'


class FeedbackStatus(models.TextChoices):
    """Feedback status choices"""
    SUBMITTED = 'Submitted', 'Gönderildi'
    IN_PROGRESS = 'InProgress', 'İnceleniyor'
    RESOLVED = 'Resolved', 'Çözüldü'
    CLOSED = 'Closed', 'Kapatıldı'


class PurchaseRequestStatus(models.TextChoices):
    """Purchase request status choices"""
    PENDING = 'Pending', 'Onay Bekliyor'
    APPROVED = 'Approved', 'Onaylandı'
    REJECTED = 'Rejected', 'Reddedildi'


class InvoiceStatus(models.TextChoices):
    """Invoice status choices"""
    UNPAID = 'Unpaid', 'Ödenmedi'
    PAID = 'Paid', 'Ödendi'


class Comment(models.Model):
    """Comment model for various entities"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(verbose_name='İçerik')
    resource = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Yorum Yapan',
        db_column='resourceId'
    )
    
    # Generic foreign keys to different models
    project = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
        verbose_name='İlgili Proje',
        db_column='projectId'
    )
    task = models.ForeignKey(
        'projects.Task',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
        verbose_name='İlgili Görev',
        db_column='taskId'
    )
    idea = models.ForeignKey(
        'ideas.Idea',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
        verbose_name='İlgili Fikir',
        db_column='ideaId'
    )
    event = models.ForeignKey(
        'events.Event',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='comments',
        verbose_name='İlgili Etkinlik',
        db_column='eventId'
    )
    
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'comments'
        verbose_name = 'Yorum'
        verbose_name_plural = 'Yorumlar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.resource.name}: {self.content[:50]}..."


class Feedback(models.Model):
    """Feedback model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(
        max_length=20,
        choices=FeedbackCategory.choices,
        verbose_name='Kategori'
    )
    status = models.CharField(
        max_length=20,
        choices=FeedbackStatus.choices,
        default=FeedbackStatus.SUBMITTED,
        verbose_name='Durum'
    )
    title = models.CharField(max_length=255, verbose_name='Başlık')
    description = models.TextField(verbose_name='Açıklama')
    resource = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='feedbacks',
        verbose_name='Geri Bildirim Veren',
        db_column='resourceId'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'feedbacks'
        verbose_name = 'Geri Bildirim'
        verbose_name_plural = 'Geri Bildirimler'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.resource.name}"


class PurchaseRequest(models.Model):
    """Purchase request model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255, verbose_name='Talep Başlığı')
    description = models.TextField(null=True, blank=True, verbose_name='Açıklama')
    amount = models.FloatField(verbose_name='Tutar')
    status = models.CharField(
        max_length=20,
        choices=PurchaseRequestStatus.choices,
        default=PurchaseRequestStatus.PENDING,
        verbose_name='Durum'
    )
    requester_id = models.CharField(max_length=36, verbose_name='Talep Eden ID', db_column='requesterId')
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'purchase_requests'
        verbose_name = 'Satın Alma Talebi'
        verbose_name_plural = 'Satın Alma Talepleri'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Invoice(models.Model):
    """Invoice model"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=100, unique=True, verbose_name='Fatura Numarası', db_column='invoiceNumber')
    amount = models.FloatField(verbose_name='Tutar')
    status = models.CharField(
        max_length=20,
        choices=InvoiceStatus.choices,
        default=InvoiceStatus.UNPAID,
        verbose_name='Durum'
    )
    due_date = models.CharField(max_length=50, verbose_name='Vade Tarihi', db_column='dueDate')
    description = models.TextField(null=True, blank=True, verbose_name='Açıklama')
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'invoices'
        verbose_name = 'Fatura'
        verbose_name_plural = 'Faturalar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.invoice_number} - {self.amount}₺"