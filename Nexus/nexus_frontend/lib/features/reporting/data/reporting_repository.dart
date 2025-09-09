// features/reporting/data/reporting_repository.dart
import 'package:dio/dio.dart';
import 'package:nexus_frontend/features/reporting/data/reporting_models.dart';

class ReportingRepository {
  final Dio _dio;
  ReportingRepository(this._dio);

  Future<ReportingSummary> getReportingSummary() async {
    try {
      final response = await _dio.get('/operations/reporting/summary/');
      return ReportingSummary.fromJson(response.data);
    } catch (e) {
      print('Error fetching reporting data: $e');
      rethrow;
    }
  }
}