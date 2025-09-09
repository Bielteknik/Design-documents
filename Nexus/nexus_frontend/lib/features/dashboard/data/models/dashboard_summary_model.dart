// features/dashboard/data/models/dashboard_summary_model.dart
// Ana Dashboard Veri Modeli
class DashboardSummary {
  final String welcomeMessage;
  final String userRole;
  final Stats stats;
  final List<RecentTask> recentTasks;
  final List<Announcement> announcements;

  DashboardSummary({
    required this.welcomeMessage,
    required this.userRole,
    required this.stats,
    required this.recentTasks,
    required this.announcements,
  });

  factory DashboardSummary.fromJson(Map<String, dynamic> json) {
    return DashboardSummary(
      welcomeMessage: json['welcome_message'] ?? 'Hoş geldiniz!',
      userRole: json['user_role'] ?? 'Kullanıcı',
      stats: Stats.fromJson(json['stats'] ?? {}),
      recentTasks: (json['recent_tasks'] as List<dynamic>? ?? [])
          .map((taskJson) => RecentTask.fromJson(taskJson))
          .toList(),
      announcements: (json['announcements'] as List<dynamic>? ?? [])
          .map((announcementJson) => Announcement.fromJson(announcementJson))
          .toList(),
    );
  }
}

// İstatistikler için alt model
class Stats {
  final int myOpenTasks;
  final int teamOverdueTasks;
  final int highPriorityAlerts;

  Stats({
    required this.myOpenTasks,
    required this.teamOverdueTasks,
    required this.highPriorityAlerts,
  });

  factory Stats.fromJson(Map<String, dynamic> json) {
    return Stats(
      myOpenTasks: json['my_open_tasks'] ?? 0,
      teamOverdueTasks: json['team_overdue_tasks'] ?? 0,
      highPriorityAlerts: json['high_priority_alerts'] ?? 0,
    );
  }

  void operator [](String other) {}
}

// Son Görevler için alt model
class RecentTask {
  final int id;
  final String title;
  final String priority;
  final String status;

  RecentTask({
    required this.id,
    required this.title,
    required this.priority,
    required this.status,
  });

  factory RecentTask.fromJson(Map<String, dynamic> json) {
    return RecentTask(
      id: json['id'] ?? 0,
      title: json['title'] ?? 'Başlıksız Görev',
      priority: json['priority'] ?? 'NORMAL',
      status: json['status'] ?? 'YENİ',
    );
  }
}

// Duyurular için alt model
class Announcement {
  final int id;
  final String title;
  final String author;
  final String date;

  Announcement({
    required this.id,
    required this.title,
    required this.author,
    required this.date,
  });

  factory Announcement.fromJson(Map<String, dynamic> json) {
    return Announcement(
      id: json['id'] ?? 0,
      title: json['title'] ?? 'Başlıksız Duyuru',
      // Django'dan author bir nesne olarak gelirse diye kontrol ekliyoruz
      author: json['author'] is Map ? json['author']['first_name'] ?? 'Bilinmiyor' : json['author'] ?? 'Bilinmiyor',
      date: json['date'] ?? '',
    );
  }
}