// features/dashboard/data/dashboard_repository.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import 'package:nexus_frontend/core/api/dio_client.dart';
import 'models/dashboard_summary_model.dart';

class DashboardRepository {
  final Dio _dio;
  DashboardRepository(this._dio);

  Future<DashboardSummary> getSummary() async {
    final response = await _dio.get('/dashboard/summary/');
    return DashboardSummary.fromJson(response.data);
  }
}

final dashboardRepositoryProvider = Provider((ref) => DashboardRepository(ref.watch(dioProvider)));

// Veriyi çekip state'te tutacak olan asıl provider (FutureProvider)
final dashboardSummaryProvider = FutureProvider<DashboardSummary>((ref) async {
  return ref.watch(dashboardRepositoryProvider).getSummary();
});