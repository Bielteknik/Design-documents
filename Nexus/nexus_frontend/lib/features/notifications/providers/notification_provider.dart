// features/notifications/providers/notification_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/core/api/dio_client.dart';
import 'package:nexus_frontend/features/notifications/data/notification_model.dart';
import 'package:nexus_frontend/features/notifications/data/notification_repository.dart';

// 1. NotificationRepository için Provider
// Artık 'NotificationRepository' bir tip olarak tanınıyor.
final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  // Dio provider'ını izleyerek repository'mizi oluşturuyoruz.
  return NotificationRepository(ref.watch(dioProvider));
});


// 2. Tüm bildirimleri API'dan çeken FutureProvider
final notificationListProvider = FutureProvider<List<NotificationModel>>((ref) async {
  final repository = ref.watch(notificationRepositoryProvider);
  return repository.getNotifications();
});


// 3. Okunmamış bildirim sayısını hesaplayan Provider
final unreadNotificationCountProvider = Provider<int>((ref) {
  final notificationListAsync = ref.watch(notificationListProvider);

  return notificationListAsync.when(
    data: (notifications) {
      return notifications.where((notification) => !notification.isRead).length;
    },
    loading: () => 0,
    error: (error, stackTrace) => 0,
  );
});