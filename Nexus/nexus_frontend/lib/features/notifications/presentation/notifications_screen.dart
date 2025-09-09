// features/notifications/presentation/notifications_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexus_frontend/features/notifications/providers/notification_provider.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final notificationsAsync = ref.watch(notificationListProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Bildirimler'),
        actions: [
          // Tümünü okundu olarak işaretle butonu
          TextButton(
            onPressed: () async {
              await ref.read(notificationRepositoryProvider).markAllAsRead();
              // Listeyi yenile
              ref.invalidate(notificationListProvider);
            },
            child: const Text('Tümünü Oku'),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref.refresh(notificationListProvider.future),
        child: notificationsAsync.when(
          data: (notifications) {
            if (notifications.isEmpty) {
              return const Center(child: Text('Yeni bildiriminiz yok.'));
            }
            return ListView.builder(
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                return ListTile(
                  tileColor: notification.isRead
                      ? null
                      : Colors.blue.withOpacity(0.1),
                  leading: notification.isRead
                      ? const Icon(
                          Icons.check_circle_outline,
                          color: Colors.grey,
                        )
                      : const Icon(Icons.circle, color: Colors.blue, size: 12),
                  title: Text(
                    notification.fullText,
                  ), // Modeldeki yardımcı getter'ı kullanıyoruz
                  subtitle: Text(notification.target),
                  onTap: () {
                    // TODO: Bildirimi tekil olarak okundu işaretle

                    // Kullanıcıyı ilgili göreve yönlendir (objectId kullanarak)
                    // ContentType'a göre yönlendirme mantığı daha sonra eklenebilir.
                    context.push('/tasks/${notification.objectId}');
                  },
                );
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, stack) =>
              Center(child: Text('Bildirimler yüklenemedi: $err')),
        ),
      ),
    );
  }
}
