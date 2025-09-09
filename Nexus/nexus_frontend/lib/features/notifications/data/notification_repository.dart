// features/notifications/data/notification_repository.dart
import 'package:dio/dio.dart';
import 'package:nexus_frontend/features/notifications/data/notification_model.dart';

class NotificationRepository {
  // Dio'yu dışarıdan alıyoruz (dependency injection)
  final Dio _dio;
  NotificationRepository(this._dio);

  // Tüm bildirimleri getiren metod
  Future<List<NotificationModel>> getNotifications() async {
    try {
      final response = await _dio.get('/communications/notifications/');
      final List<dynamic> data = response.data;
      return data.map((json) => NotificationModel.fromJson(json)).toList();
    } catch (e) {
      print('Bildirimler getirilirken hata oluştu: $e');
      rethrow; // Hatayı yukarı katmana tekrar fırlat
    }
  }

  // Tüm bildirimleri okundu olarak işaretleyen metod
  Future<void> markAllAsRead() async {
    try {
      await _dio.post('/communications/notifications/mark_all_as_read/');
    } catch (e) {
      print('Bildirimler okunmuş olarak işaretlenirken hata oluştu: $e');
      rethrow;
    }
  }

  // Tek bir bildirimi okundu olarak işaretleyen metod (gelecek için)
  Future<void> markAsRead(int notificationId) async {
    // TODO: Django tarafında bu endpoint'i oluştur
    // await _dio.post('/communications/notifications/$notificationId/mark_as_read/');
  }
}