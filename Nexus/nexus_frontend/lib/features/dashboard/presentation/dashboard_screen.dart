// features/dashboard/presentation/dashboard_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexus_frontend/features/dashboard/data/dashboard_repository.dart';
import 'package:nexus_frontend/features/dashboard/data/models/dashboard_summary_model.dart';
import 'package:nexus_frontend/features/notifications/providers/notification_provider.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // dashboardSummaryProvider'ı dinliyoruz
    final summaryAsyncValue = ref.watch(dashboardSummaryProvider);
    // -- ARTIK BU SATIR HATA VERMEYECEK --
    final unreadCount = ref.watch(unreadNotificationCountProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Nexus Dashboard'),
        actions: [
          Badge(
            label: Text(unreadCount.toString()),
            isLabelVisible: unreadCount > 0,
            child: IconButton(
              icon: const Icon(Icons.notifications_outlined),
              onPressed: () {
                context.push('/notifications');
              },
            ),
          ),
        ],
      ),
      body: summaryAsyncValue.when(
        // Veri başarıyla yüklendiğinde bu kısım çalışır
        data: (summary) => RefreshIndicator(
          onRefresh: () => ref.refresh(dashboardSummaryProvider.future),
          child: ListView(
            padding: const EdgeInsets.all(16.0),
            children: [
              // 1. Karşılama Kartı
              Text(
                summary.welcomeMessage,
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 20),

              // 2. İstatistik Kartları
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  // --- HATA BURADAYDI, DÜZELTİLDİ ---
                  // Eski: summary.stats['my_open_tasks'].toString()
                  // Yeni: summary.stats.myOpenTasks.toString()
                  _buildStatCard(
                    'Açık Görevlerim',
                    summary.stats.myOpenTasks.toString(),
                  ),
                  _buildStatCard(
                    'Ekip Gecikmeleri',
                    summary.stats.teamOverdueTasks.toString(),
                  ),
                  _buildStatCard(
                    'Önemli Bildirimler',
                    summary.stats.highPriorityAlerts.toString(),
                  ),
                ],
              ),
              const SizedBox(height: 30),

              // 3. Görevlerim Kartı
              _buildSectionHeader(
                context,
                title: 'Son Görevler',
                onSeeAll: () =>
                    context.go('/tasks'), // Tüm görevler sayfasına git
              ),
              _buildRecentTasks(summary.recentTasks),

              const SizedBox(height: 30),

              // 4. Duyurular Kartı
              _buildSectionHeader(
                context,
                title: 'Duyurular',
                onSeeAll: () {
                  /* TODO: Duyurular sayfasına git */
                },
              ),
              _buildAnnouncements(summary.announcements),
            ],
          ),
        ),
        // Veri yüklenirken bu kısım (bir yüklenme animasyonu) gösterilir
        loading: () => const Center(child: CircularProgressIndicator()),
        // Hata oluştuğunda bu kısım gösterilir
        error: (err, stack) =>
            Center(child: Text('Dashboard verileri yüklenemedi: $err')),
      ),
    );
  }
  // İstatistik kartları için yardımcı bir widget
  Widget _buildStatCard(String title, String value) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Text(
                value,
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(title, textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
  // Bölüm başlığı için yardımcı widget
  Widget _buildSectionHeader(
    BuildContext context, {
    required String title,
    VoidCallback? onSeeAll,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleLarge),
        if (onSeeAll != null)
          TextButton(onPressed: onSeeAll, child: const Text('Tümünü Gör')),
      ],
    );
  }
  // Son görevler listesi için yardımcı widget
  Widget _buildRecentTasks(List<RecentTask> tasks) {
    if (tasks.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('Gösterilecek yeni görev yok.'),
      );
    }
    return Column(
      children: tasks
          .map(
            (task) => ListTile(
              title: Text(task.title),
              subtitle: Text('Durum: ${task.status}'),
              trailing: Chip(label: Text(task.priority)),
              onTap: () {
                /* TODO: Görev detayına git */
              },
            ),
          )
          .toList(),
    );
  }
  // Duyurular listesi için yardımcı widget
  Widget _buildAnnouncements(List<Announcement> announcements) {
    if (announcements.isEmpty) {
      return const Padding(
        padding: EdgeInsets.all(16.0),
        child: Text('Gösterilecek yeni duyuru yok.'),
      );
    }
    return Column(
      children: announcements
          .map(
            (announcement) => Card(
              child: ListTile(
                title: Text(announcement.title),
                subtitle: Text('${announcement.author} - ${announcement.date}'),
                onTap: () {
                  /* TODO: Duyuru detayına git */
                },
              ),
            ),
          )
          .toList(),
    );
  }
}
