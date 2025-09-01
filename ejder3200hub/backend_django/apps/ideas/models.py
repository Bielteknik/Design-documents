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
        verbose_name='Yazar',
        db_column='authorId'
    )
    
    # Basic Information
    category = models.CharField(max_length=100, null=True, blank=True, verbose_name='Kategori')
    description = models.TextField(null=True, blank=True, verbose_name='Açıklama')
    summary = models.TextField(null=True, blank=True, verbose_name='Özet')
    
    # Problem Analysis
    problem = models.TextField(null=True, blank=True, verbose_name='Problem')
    problem_type = models.CharField(max_length=50, null=True, blank=True, verbose_name='Problem Tipi', db_column='problemType')
    problem_frequency = models.CharField(max_length=50, null=True, blank=True, verbose_name='Problem Sıklığı', db_column='problemFrequency')
    solution = models.TextField(null=True, blank=True, verbose_name='Çözüm')
    
    # Strategic Framework
    benefits = models.TextField(null=True, blank=True, verbose_name='Faydalar')
    target_audience = models.TextField(null=True, blank=True, verbose_name='Hedef Kitle', db_column='targetAudience')
    related_departments = ArrayField(
        models.CharField(max_length=100),
        default=list,
        blank=True,
        verbose_name='İlgili Departmanlar',
        db_column='relatedDepartments'
    )
    
    # Assignments and Responsibility
    project_leader = models.ForeignKey(
        'resources.Resource',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='led_ideas',
        verbose_name='Proje Lideri',
        db_column='projectLeaderId'
    )
    potential_team = ArrayField(
        models.CharField(max_length=36),
        default=list,
        blank=True,
        verbose_name='Potansiyel Takım',
        db_column='potentialTeam'
    )
    
    # Timeline
    estimated_duration = models.CharField(max_length=100, null=True, blank=True, verbose_name='Tahmini Süre', db_column='estimatedDuration')
    timeline_phases = models.JSONField(null=True, blank=True, verbose_name='Zaman Çizelgesi Aşamaları', db_column='timelinePhases')
    critical_milestones = models.TextField(null=True, blank=True, verbose_name='Kritik Kilometre Taşları', db_column='criticalMilestones')
    
    # Budget Plan
    total_budget = models.FloatField(null=True, blank=True, verbose_name='Toplam Bütçe', db_column='totalBudget')
    budget_items = models.JSONField(null=True, blank=True, verbose_name='Bütçe Kalemleri', db_column='budgetItems')
    
    # ROI Analysis
    expected_revenue_increase = models.FloatField(null=True, blank=True, verbose_name='Beklenen Gelir Artışı', db_column='expectedRevenueIncrease')
    expected_cost_savings = models.FloatField(null=True, blank=True, verbose_name='Beklenen Maliyet Tasarrufu', db_column='expectedCostSavings')
    expected_roi = models.FloatField(null=True, blank=True, verbose_name='Beklenen ROI', db_column='expectedROI')
    funding_sources = models.TextField(null=True, blank=True, verbose_name='Finansman Kaynakları', db_column='fundingSources')
    revenue_sources = models.TextField(null=True, blank=True, verbose_name='Gelir Kaynakları', db_column='revenueSources')
    
    # SWOT Analysis
    swot_strengths = models.TextField(null=True, blank=True, verbose_name='Güçlü Yönler', db_column='swotStrengths')
    swot_weaknesses = models.TextField(null=True, blank=True, verbose_name='Zayıf Yönler', db_column='swotWeaknesses')
    swot_opportunities = models.TextField(null=True, blank=True, verbose_name='Fırsatlar', db_column='swotOpportunities')
    swot_threats = models.TextField(null=True, blank=True, verbose_name='Tehditler', db_column='swotThreats')
    
    # Risk Analysis
    risks = models.TextField(null=True, blank=True, verbose_name='Riskler')
    risk_level = models.CharField(max_length=20, null=True, blank=True, verbose_name='Risk Seviyesi', db_column='riskLevel')
    mitigations = models.TextField(null=True, blank=True, verbose_name='Risk Azaltma')
    
    # Success Criteria
    success_criteria = models.TextField(null=True, blank=True, verbose_name='Başarı Kriterleri', db_column='successCriteria')
    
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
    creation_date = models.CharField(max_length=50, null=True, blank=True, verbose_name='Oluşturma Tarihi', db_column='creationDate')
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

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
        verbose_name='Fikir',
        db_column='ideaId'
    )
    resource = models.ForeignKey(
        'resources.Resource',
        on_delete=models.CASCADE,
        related_name='votes',
        verbose_name='Oy Veren',
        db_column='resourceId'
    )
    status = models.CharField(
        max_length=20,
        choices=VoteStatus.choices,
        verbose_name='Oy Durumu'
    )
    created_at = models.DateTimeField(auto_now_add=True, db_column='createdAt')
    updated_at = models.DateTimeField(auto_now=True, db_column='updatedAt')

    class Meta:
        db_table = 'votes'
        verbose_name = 'Oy'
        verbose_name_plural = 'Oylar'
        unique_together = ['idea', 'resource']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.resource.name} -> {self.idea.name} ({self.get_status_display()})"