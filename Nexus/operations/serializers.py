# operations/serializers.py
from rest_framework import serializers
from .models import Task, Department, TaskComment, TaskAttachment
from users.serializers import UserSerializer # Kullanıcı bilgilerini göstermek için

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    # İlişkili modellerin sadece ID'si yerine detaylarını göstermek için
    # read_only=True -> Bu alanlar sadece okunabilir, görev oluştururken gönderilmez
    creator = UserSerializer(read_only=True)
    assignee = UserSerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)

    comments = TaskCommentSerializer(many=True, read_only=True)
    attachments = TaskAttachmentSerializer(many=True, read_only=True)    
    
    # Görev oluştururken/güncellerken ID gönderebilmek için
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    department_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority', 'due_date',
            'creator', 'assignee', 'department', 'created_at', 'updated_at',
            'assignee_id', 'department_id', 'comments', 'attachments'
        ]
        read_only_fields = ['id', 'creator', 'created_at', 'updated_at']

    # Görevi oluşturan kişiyi otomatik olarak isteği yapan kullanıcı olarak ayarla
    def create(self, validated_data):
        validated_data['creator'] = self.context['request'].user
        return super().create(validated_data)

class TaskCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    class Meta:
        model = TaskComment
        fields = ['id', 'author', 'content', 'created_at']

class TaskAttachmentSerializer(serializers.ModelSerializer):
    uploader = UserSerializer(read_only=True)
    class Meta:
        model = TaskAttachment
        fields = ['id', 'uploader', 'file', 'description', 'uploaded_at']

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['name']

class RoleSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)
    class Meta:
        model = Role
        fields = ['name', 'permissions']

class UserSerializer(serializers.ModelSerializer):
    roles = RoleSerializer(many=True, read_only=True)
    class Meta:
        # ...
        fields = ['id', 'email', 'first_name', 'last_name', 'roles']

