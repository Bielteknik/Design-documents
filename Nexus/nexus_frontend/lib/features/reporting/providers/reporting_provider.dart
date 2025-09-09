// features/reporting/providers/reporting_provider.dart
// Repository Provider
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/core/api/dio_client.dart';
import 'package:nexus_frontend/features/reporting/data/reporting_models.dart';
import 'package:nexus_frontend/features/reporting/data/reporting_repository.dart';

final reportingRepositoryProvider = Provider<ReportingRepository>((ref) {
  return ReportingRepository(ref.watch(dioProvider));
});

// Main data provider
final reportingSummaryProvider = FutureProvider<ReportingSummary>((ref) {
  final repository = ref.watch(reportingRepositoryProvider);
  return repository.getReportingSummary();
});