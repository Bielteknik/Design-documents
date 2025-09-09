# operations/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Task, Department
from .serializers import TaskSerializer, DepartmentSerializer
from rest_framework import generics
from .serializers import TaskCommentSerializer, TaskAttachmentSerializer
from django.db.models import Count, Q, Avg
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Task
from django.contrib.auth import get_user_model
from nexus_backend.permissions import HasPermission, IsTaskOwnerOrAdmin

user = get_user_model()

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().select_related('creator', 'assignee', 'department')
    serializer_class = TaskSerializer
    # permission_classes = [IsAuthenticated] # Eski satırı değiştiriyoruz

    def get_permissions(self):
        """ Her action (list, create, retrieve vb.) için farklı yetki belirle. """
        if self.action in ['update', 'partial_update', 'destroy']:
            # Güncelleme ve silme için: ya görevin sahibi olmalı ya da yönetici
            return [IsTaskOwnerOrAdmin()]
        elif self.action == 'create':
            # Görev oluşturmak için 'tasks.create' yetkisi gerekli
            return [HasPermission(required_permissions=['tasks.create'])]
        # Diğer tüm durumlar için (list, retrieve) sadece giriş yapmış olması yeterli
        return [IsAuthenticated()]

    def get_queryset(self):
        """ Kullanıcıları sadece ilgili görevleri görecek şekilde filtrele. """
        user = self.request.user
        
        # Eğer kullanıcı 'tasks.view_all' yetkisine sahipse, tüm görevleri göster
        if user.roles.filter(permissions__name='tasks.view_all').exists():
            return Task.objects.all().select_related('creator', 'assignee', 'department')
        
        # Aksi halde, sadece kendisine atanmış veya kendisinin oluşturduğu görevleri göster
        return Task.objects.filter(Q(assignee=user) | Q(creator=user))\
                           .select_related('creator', 'assignee', 'department')

    # Yeni eklenen özel action
    @action(detail=True, methods=['post'], url_path='change-status')
    def change_status(self, request, pk=None):
        """Bir görevin durumunu değiştirmek için özel endpoint."""
        task = self.get_object()
        new_status = request.data.get('status')

        # Gönderilen status'un geçerli bir seçenek olup olmadığını kontrol et
        valid_statuses = [choice[0] for choice in Task.Status.choices]
        if not new_status or new_status not in valid_statuses:
            return Response(
                {'error': 'Geçersiz bir durum (status) değeri gönderildi.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        task.status = new_status
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    # Yetkilendirme: Kullanıcılar sadece kendi departmanlarındaki görevleri görsün gibi
    # kuralları buraya ekleyeceğiz. Şimdilik herkes her şeyi görüyor.
    # def get_queryset(self):
    #     user = self.request.user
    #     return Task.objects.filter(department=user.department)

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

class TaskCommentCreateView(generics.CreateAPIView):
    queryset = TaskComment.objects.all()
    serializer_class = TaskCommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        task = Task.objects.get(pk=self.kwargs['task_pk'])
        serializer.save(author=self.request.user, task=task)

class TaskAttachmentCreateView(generics.CreateAPIView):
    queryset = TaskAttachment.objects.all()
    serializer_class = TaskAttachmentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        task = Task.objects.get(pk=self.kwargs['task_pk'])
        serializer.save(uploader=self.request.user, task=task)

class ReportingDataView(APIView):
    permission_classes = [HasPermission(required_permissions=['reporting.view'])]

    def get(self, request, *args, **kwargs):       

        # Son 30 gün için bir zaman aralığı belirleyelim
        last_30_days = timezone.now() - timedelta(days=30)

        # 1. Görev Durumlarına Göre Dağılım (Tüm Zamanlar)
        task_status_distribution = Task.objects.values('status').annotate(count=Count('id')).order_by('status')

        # 2. Departmanlara Göre Açık Görev Sayısı
        tasks_by_department = Task.objects.filter(status__in=['NEW', 'ASSIGNED', 'IN_PROGRESS'])\
                                          .values('department__name')\
                                          .annotate(count=Count('id'))\
                                          .order_by('-count')

        # 3. Personel Performansı (Son 30 günde en çok görev kapatanlar)
        user_performance = User.objects.filter(assigned_tasks__status='COMPLETED', assigned_tasks__updated_at__gte=last_30_days)\
                                       .annotate(completed_tasks=Count('assigned_tasks'))\
                                       .values('first_name', 'last_name', 'completed_tasks')\
                                       .order_by('-completed_tasks')[:5] # İlk 5 kişiyi alalım

        # 4. Aylık Görev Oluşturma Trendi (Son 6 Ay)
        monthly_trend = Task.objects.annotate(month=TruncMonth('created_at'))\
                                    .values('month')\
                                    .annotate(count=Count('id'))\
                                    .order_by('month')

        # Tüm verileri tek bir JSON nesnesinde toplayalım
        data = {
            'task_status_distribution': list(task_status_distribution),
            'open_tasks_by_department': list(tasks_by_department),
            'top_performers': list(user_performance),
            'monthly_creation_trend': list(monthly_trend),
        }
        
        return Response(data)


