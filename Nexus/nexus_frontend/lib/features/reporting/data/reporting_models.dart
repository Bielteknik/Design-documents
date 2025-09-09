// features/reporting/data/reporting_models.dart

// 1. Model for the main reporting summary object
class ReportingSummary {
  final List<StatusDistribution> taskStatusDistribution;
  final List<DepartmentTaskCount> openTasksByDepartment;
  final List<TopPerformer> topPerformers;
  final List<MonthlyTrend> monthlyCreationTrend;

  ReportingSummary({
    required this.taskStatusDistribution,
    required this.openTasksByDepartment,
    required this.topPerformers,
    required this.monthlyCreationTrend,
  });

  factory ReportingSummary.fromJson(Map<String, dynamic> json) {
    return ReportingSummary(
      taskStatusDistribution: (json['task_status_distribution'] as List<dynamic>? ?? [])
          .map((item) => StatusDistribution.fromJson(item))
          .toList(),
      openTasksByDepartment: (json['open_tasks_by_department'] as List<dynamic>? ?? [])
          .map((item) => DepartmentTaskCount.fromJson(item))
          .toList(),
      topPerformers: (json['top_performers'] as List<dynamic>? ?? [])
          .map((item) => TopPerformer.fromJson(item))
          .toList(),
      monthlyCreationTrend: (json['monthly_creation_trend'] as List<dynamic>? ?? [])
          .map((item) => MonthlyTrend.fromJson(item))
          .toList(),
    );
  }
}

// 2. Model for task status distribution (Pie Chart)
class StatusDistribution {
  final String status;
  final int count;

  StatusDistribution({required this.status, required this.count});

  factory StatusDistribution.fromJson(Map<String, dynamic> json) {
    return StatusDistribution(
      status: json['status'] ?? 'Unknown',
      count: json['count'] ?? 0,
    );
  }
}

// 3. Model for open tasks by department (Bar Chart)
class DepartmentTaskCount {
  final String departmentName;
  final int count;

  DepartmentTaskCount({required this.departmentName, required this.count});

  factory DepartmentTaskCount.fromJson(Map<String, dynamic> json) {
    return DepartmentTaskCount(
      departmentName: json['department__name'] ?? 'No Department',
      count: json['count'] ?? 0,
    );
  }
}

// 4. Model for top performers
class TopPerformer {
  final String firstName;
  final String lastName;
  final int completedTasks;

  TopPerformer({
    required this.firstName,
    required this.lastName,
    required this.completedTasks,
  });

  String get fullName => '$firstName $lastName';

  factory TopPerformer.fromJson(Map<String, dynamic> json) {
    return TopPerformer(
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      completedTasks: json['completed_tasks'] ?? 0,
    );
  }
}

// 5. Model for monthly trend (Line Chart)
class MonthlyTrend {
  final DateTime month;
  final int count;

  MonthlyTrend({required this.month, required this.count});

  factory MonthlyTrend.fromJson(Map<String, dynamic> json) {
    return MonthlyTrend(
      month: DateTime.parse(json['month']),
      count: json['count'] ?? 0,
    );
  }
}