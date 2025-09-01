from django.db import models
from django.contrib.postgres.fields import ArrayField
from apps.projects.models import Priority
import uuid


class IdeaStatus(models.TextChoices):
    """Idea status choices"""
    NEW = 'New', 'Yeni Fikir'
    EVALUATING = 'Evaluating', 'Değerlendirmede'
    APPROVED = 'Approved', 'Onaylandı'
    ARCHIVED = 'Archived', 'Arşivlendi'


class VoteStatus(models.TextChoices):
    """Vote status choices"""
    SUPPORTS = 'Supports', 'Destekliyor'
    NEUTRAL = 'Neutral', 'Nötr'
    OPPOSED = 'Opposed', 'Karşı'


class Idea(models.Model):
    """Idea model for innovation center"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, verbose_name='Fikir Başlığı')
    status = models.CharField(
        max_length=20,
        choices=IdeaStatus.choices,
        default=IdeaStatus.NEW,
        verbose_name='Durum'
    )
    author = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='authored_ideas',
        verbose_name='Yazar'
    )
    
    # Basic Information
    category = models.CharField(max_length=100, null=True, blank=True, verbose_name='Kategori')
    description = models.TextField(null=True, blank=True, verbose_name='Açıklama')
    summary = models.TextField(null=True, blank=True, verbose_name='Özet')
    
    # Problem Analysis
    problem = models.TextField(null=True, blank=True, verbose_name='Problem')
    problem_type = models.CharField(max_length=50, null=True, blank=True, verbose_name='Problem Tipi')
    problem_frequency = models.CharField(max_length=50, null=True, blank=True, verbose_name='Problem Sıklığı')
    solution = models.TextField(null=True, blank=True, verbose_name='Çözüm')
    
    # Strategic Framework
    benefits = models.TextField(null=True, blank=True, verbose_name='Faydalar')
    target_audience = models.TextField(null=True, blank=True, verbose_name='Hedef Kitle')
    related_departments = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        verbose_name='İlgili Departmanlar'
    )
    
    # Assignments and Responsibility
    project_leader = models.ForeignKey(
        'resources.Resource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='led_ideas',
        verbose_name='Proje Lideri'
    )
    potential_team = ArrayField(
        models.CharField(max_length=36),
        default=list,
        blank=True,
        verbose_name='Potansiyel Takım'
    )
    
    # Timeline
    estimated_duration = models.CharField(max_length=100, null=True, blank=True, verbose_name='Tahmini Süre')
    timeline_phases = models.JSONField(null=True, blank=True, verbose_name='Zaman Çizelgesi Aşamaları')
    critical_milestones = models.TextField(null=True, blank=True, verbose_name='Kritik Kilometre Taşları')
    
    # Budget Plan
    total_budget = models.FloatField(null=True, blank=True, verbose_name='Toplam Bütçe')
    budget_items = models.JSONField(null=True, blank=True, verbose_name='Bütçe Kalemleri')
    
    # ROI Analysis
    expected_revenue_increase = models.FloatField(null=True, blank=True, verbose_name='Beklenen Gelir Artışı')
    expected_cost_savings = models.FloatField(null=True, blank=True, verbose_name='Beklenen Maliyet Tasarrufu')
    expected_roi = models.FloatField(null=True, blank=True, verbose_name='Beklenen ROI')
    funding_sources = models.TextField(null=True, blank=True, verbose_name='Finansman Kaynakları')
    revenue_sources = models.TextField(null=True, blank=True, verbose_name='Gelir Kaynakları')
    
    # SWOT Analysis
    swot_strengths = models.TextField(null=True, blank=True, verbose_name='Güçlü Yönler')
    swot_weaknesses = models.TextField(null=True, blank=True, verbose_name='Zayıf Yönler')
    swot_opportunities = models.TextField(null=True, blank=True, verbose_name='Fırsatlar')
    swot_threats = models.TextField(null=True, blank=True, verbose_name='Tehditler')
    
    # Risk Analysis
    risks = models.TextField(null=True, blank=True, verbose_name='Riskler')
    risk_level = models.CharField(max_length=20, null=True, blank=True, verbose_name='Risk Seviyesi')
    mitigations = models.TextField(null=True, blank=True, verbose_name='Risk Azaltma')
    
    # Success Criteria
    success_criteria = models.TextField(null=True, blank=True, verbose_name='Başarı Kriterleri')
    
    # Support
    files = ArrayField(
        models.CharField(max_length=500),
        default=list,
        blank=True,
        verbose_name='Dosyalar'
    )
    tags = ArrayField(
        models.CharField(max_length=50),
        default=list,
        blank=True,
        verbose_name='Etiketler'
    )
    priority = models.CharField(
        max_length=20,
        choices=Priority.choices,
        null=True,
        blank=True,
        verbose_name='Öncelik'
    )
    creation_date = models.CharField(max_length=50, null=True, blank=True, verbose_name='Oluşturma Tarihi')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ideas'
        verbose_name = 'Fikir'
        verbose_name_plural = 'Fikirler'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.author.name}"


class Vote(models.Model):
    """Vote model for ideas"""
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    idea = models.ForeignKey(
        Idea,
        on_delete=models.CASCADE,
        related_name='votes',
        verbose_name='Fikir'
    )
    resource = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='votes',
        verbose_name='Oy Veren'
    )
    status = models.CharField(
        max_length=20,
        choices=VoteStatus.choices,
        verbose_name='Oy Durumu'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'votes'
        verbose_name = 'Oy'
        verbose_name_plural = 'Oylar'
        unique_together = ['idea', 'resource']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.resource.name} -> {self.idea.name} ({self.get_status_display()})"