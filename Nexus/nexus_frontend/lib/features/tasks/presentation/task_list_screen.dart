// features/tasks/presentation/task_list_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexus_frontend/features/auth/providers/auth_state_provider.dart'; // userPermissionsProvider için
import 'package:nexus_frontend/features/tasks/data/models/task_model.dart';
import 'package:nexus_frontend/features/tasks/data/task_repository.dart';

class TaskListScreen extends ConsumerWidget {
  const TaskListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Tüm görevleri getiren provider'ı dinle
    final taskListAsyncValue = ref.watch(taskListProvider);

    // Kullanıcının yetkilerini getiren provider'ı dinle
    final userPermissions = ref.watch(userPermissionsProvider);

    // Kullanıcının 'tasks.create' yetkisine sahip olup olmadığını kontrol et
    final canCreateTasks = userPermissions.contains('tasks.create');

    return Scaffold(
      appBar: AppBar(title: const Text('Tüm Görevler')),
      body: RefreshIndicator(
        // Ekranı aşağı çekerek listeyi manuel olarak yenileme
        onRefresh: () => ref.refresh(taskListProvider.future),
        child: taskListAsyncValue.when(
          // Veri başarıyla yüklendiğinde listeyi göster
          data: (tasks) {
            // Eğer hiç görev yoksa, kullanıcıya bilgi ver
            if (tasks.isEmpty) {
              return const Center(
                child: Text(
                  'Henüz hiç görev bulunmuyor.\nYeni bir görev oluşturmak için + butonuna dokunun.',
                  textAlign: TextAlign.center,
                ),
              );
            }

            // Görevleri ListView.builder ile verimli bir şekilde listele
            return ListView.builder(
              itemCount: tasks.length,
              itemBuilder: (context, index) {
                final task = tasks[index];
                return TaskListItem(
                  task: task,
                ); // Her bir görev için özel bir widget kullan
              },
            );
          },
          // Veri yüklenirken bir yüklenme animasyonu göster
          loading: () => const Center(child: CircularProgressIndicator()),
          // Hata oluştuğunda bir hata mesajı göster
          error: (err, stack) => Center(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Text('Görevler yüklenemedi: $err'),
            ),
          ),
        ),
      ),
      // Kullanıcının yetkisi varsa FloatingActionButton'u göster, yoksa null ata (gizle)
      floatingActionButton: canCreateTasks
          ? FloatingActionButton(
              onPressed: () {
                // Yeni görev oluşturma ekranına yönlendir
                context.push('/tasks/create');
              },
              tooltip: 'Yeni Görev Oluştur',
              child: const Icon(Icons.add),
            )
          : null,
    );
  }
}

/// Her bir görev satırını temsil eden, daha temiz kod için ayrılmış bir widget.
class TaskListItem extends StatelessWidget {
  const TaskListItem({super.key, required this.task});

  final Task task;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      child: ListTile(
        leading: Icon(
          _getIconForStatus(task.status),
          color: _getColorForStatus(task.status),
        ),
        title: Text(task.title),
        subtitle: Text('Atanan: ${task.assignee?.fullName ?? 'Atanmamış'}'),
        trailing: Chip(
          label: Text(
            task.priority,
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
          backgroundColor: _getColorForPriority(task.priority),
        ),
        onTap: () {
          // Görev detay sayfasına yönlendir
          context.push('/tasks/${task.id}');
        },
      ),
    );
  }

  // Görev durumuna göre ikon döndüren yardımcı fonksiyon
  IconData _getIconForStatus(String status) {
    switch (status) {
      case 'NEW':
        return Icons.fiber_new_outlined;
      case 'ASSIGNED':
        return Icons.person_outline;
      case 'IN_PROGRESS':
        return Icons.hourglass_top_outlined;
      case 'COMPLETED':
        return Icons.check_circle_outline;
      case 'CANCELLED':
        return Icons.cancel_outlined;
      default:
        return Icons.help_outline;
    }
  }

  // Görev durumuna göre renk döndüren yardımcı fonksiyon
  Color _getColorForStatus(String status) {
    switch (status) {
      case 'COMPLETED':
        return Colors.green;
      case 'CANCELLED':
        return Colors.red;
      default:
        return Colors.grey.shade600;
    }
  }

  // Görev önceliğine göre renk döndüren yardımcı fonksiyon
  Color _getColorForPriority(String priority) {
    switch (priority) {
      case 'URGENT':
        return Colors.red;
      case 'HIGH':
        return Colors.orange;
      case 'LOW':
        return Colors.green;
      case 'NORMAL':
      default:
        return Colors.blue;
    }
  }
}
