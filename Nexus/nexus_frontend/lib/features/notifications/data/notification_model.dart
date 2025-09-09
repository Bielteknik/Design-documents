// features/notifications/data/notification_model.dart

// Bildirim modeli, diğer modellerden User bilgisini kullanacağı için
// User modelini import ediyoruz. En iyi pratik, User modelini
// features/auth altından alıp core/models gibi ortak bir yere taşımaktır.
// Şimdilik, task_model.dart içindeki UserModel tanımını kullandığımızı varsayalım.
import 'package:nexus_frontend/features/tasks/data/models/task_model.dart'; // UserModel için

class NotificationModel {
  final int id;
  final UserModel actor;
  final String verb;
  final String target;
  final bool isRead;
  final DateTime timestamp;
  
  // Bildirime tıklandığında hangi göreve gideceğimizi bilmek için
  // content_object'in ID'sini ve tipini de saklayalım.
  final int objectId;
  final int contentTypeId;

  NotificationModel({
    required this.id,
    required this.actor,
    required this.verb,
    required this.target,
    required this.isRead,
    required this.timestamp,
    required this.objectId,
    required this.contentTypeId,
  });

  factory NotificationModel.fromJson(Map<String, dynamic> json) {
    return NotificationModel(
      id: json['id'] ?? 0,
      
      // 'actor' alanı bir nesne olduğu için UserModel.fromJson ile parse ediyoruz.
      actor: UserModel.fromJson(json['actor'] ?? {}),
      
      verb: json['verb'] ?? '',
      
      // Django'dan gelen 'target' alanı genellikle string bir ifadedir.
      target: json['target'] ?? '',
      
      isRead: json['is_read'] ?? false,
      
      // Tarih alanını DateTime nesnesine çeviriyoruz.
      timestamp: DateTime.parse(json['timestamp']),
      
      objectId: json['object_id'] ?? 0,
      
      contentTypeId: json['content_type'] ?? 0,
    );
  }

  // Bildirimin tam metnini oluşturan bir yardımcı getter.
  // Örnek: "Ahmet Yılmaz size yeni bir görev atadı: Pist-5 Kar Makinesi Arızası"
  String get fullText {
    return '${actor.fullName} ${verb} ${target}';
  }
}