// features/tasks/data/models/task_model.dart
// Kullanıcı ve Departman gibi alt modelleri de burada tanımlayabiliriz
class UserModel {
  final int id;
  final String firstName;
  final String lastName;
  final String email;

  UserModel({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
  });
  String get fullName => '$firstName $lastName';
  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'] ?? 0,
    firstName: json['first_name'] ?? '',
    lastName: json['last_name'] ?? '',
    email: json['email'] ?? '',
  );
}

class DepartmentModel {
  final int id;
  final String name;

  DepartmentModel({required this.id, required this.name});

  factory DepartmentModel.fromJson(Map<String, dynamic> json) {
    return DepartmentModel(id: json['id'] ?? 0, name: json['name'] ?? '');
  }
}
// YENİ EKLENEN YORUM MODELİ
class TaskComment {
  final int id;
  final UserModel author;
  final String content;
  final DateTime createdAt;

  TaskComment({
    required this.id,
    required this.author,
    required this.content,
    required this.createdAt,
  });

  factory TaskComment.fromJson(Map<String, dynamic> json) {
    return TaskComment(
      id: json['id'] ?? 0,
      author: UserModel.fromJson(json['author'] ?? {}),
      content: json['content'] ?? '',
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}
// YENİ EKLENEN EK DOSYA MODELİ
class TaskAttachment {
  final int id;
  final UserModel uploader;
  final String fileUrl;
  final String? description;
  final DateTime uploadedAt;

  TaskAttachment({
    required this.id,
    required this.uploader,
    required this.fileUrl,
    this.description,
    required this.uploadedAt,
  });

  factory TaskAttachment.fromJson(Map<String, dynamic> json) {
    return TaskAttachment(
      id: json['id'] ?? 0,
      uploader: UserModel.fromJson(json['uploader'] ?? {}),
      fileUrl: json['file'] ?? '',
      description: json['description'],
      uploadedAt: DateTime.parse(json['uploaded_at']),
    );
  }
}
// Ana Task Modeli - GÜNCELLENMİŞ HALİ
class Task {
  final int id;
  final String title;
  final String? description;
  final String status;
  final String priority;
  final DateTime? dueDate;
  final DateTime createdAt;
  final DateTime updatedAt;
  final UserModel? creator;
  final UserModel? assignee;
  final DepartmentModel? department;
  
  // YENİ EKLENEN ALANLAR
  final List<TaskComment> comments;
  final List<TaskAttachment> attachments;

  Task({
    required this.id,
    required this.title,
    this.description,
    required this.status,
    required this.priority,
    this.dueDate,
    required this.createdAt,
    required this.updatedAt,
    this.creator,
    this.assignee,
    this.department,
    required this.comments,     // Constructor'a eklendi
    required this.attachments,  // Constructor'a eklendi
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'] ?? 0,
      title: json['title'] ?? 'Başlıksız Görev',
      description: json['description'],
      status: json['status'] ?? 'NEW',
      priority: json['priority'] ?? 'NORMAL',
      dueDate: json['due_date'] == null ? null : DateTime.parse(json['due_date']),
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
      creator: json['creator'] == null ? null : UserModel.fromJson(json['creator']),
      assignee: json['assignee'] == null ? null : UserModel.fromJson(json['assignee']),
      department: json['department'] == null ? null : DepartmentModel.fromJson(json['department']),
      
      // YENİ EKLENEN PARSİNG MANTIĞI
      comments: (json['comments'] as List<dynamic>? ?? [])
          .map((commentJson) => TaskComment.fromJson(commentJson))
          .toList(),
      attachments: (json['attachments'] as List<dynamic>? ?? [])
          .map((attachmentJson) => TaskAttachment.fromJson(attachmentJson))
          .toList(),
    );
  }
}

