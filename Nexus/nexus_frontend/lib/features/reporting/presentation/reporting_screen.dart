// features/reporting/presentation/reporting_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:nexus_frontend/features/reporting/data/reporting_models.dart';
import 'package:nexus_frontend/features/reporting/providers/reporting_provider.dart';

class ReportingScreen extends ConsumerWidget {
  const ReportingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reportingDataAsync = ref.watch(reportingSummaryProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('Raporlar')),
      body: reportingDataAsync.when(
        data: (summary) => ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            Text('Görev Durum Dağılımı', style: Theme.of(context).textTheme.titleLarge),
            SizedBox(
              height: 250,
              child: _buildPieChart(summary.taskStatusDistribution),
            ),
            const Divider(height: 40),
            
            Text('Departmanların Açık Görevleri', style: Theme.of(context).textTheme.titleLarge),
            SizedBox(
              height: 300,
              // --- THIS IS THE FIX FOR THE BarChart ERROR ---
              child: _buildBarChart(summary.openTasksByDepartment),
            ),
            
            const Divider(height: 40),
            Text('En İyi Performans Gösterenler', style: Theme.of(context).textTheme.titleLarge),
            _buildTopPerformersList(summary.topPerformers),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Rapor verileri yüklenemedi: $err')),
      ),
    );
  }

  // --- Helper Widgets ---

  Widget _buildPieChart(List<StatusDistribution> data) {
    if (data.isEmpty) return const Center(child: Text('Veri yok'));
    
    return PieChart(
      PieChartData(
        sectionsSpace: 2,
        centerSpaceRadius: 40,
        sections: data.map((item) {
          return PieChartSectionData(
            color: _getColorForStatus(item.status),
            value: item.count.toDouble(),
            title: '${item.count}',
            radius: 50,
            titleStyle: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildBarChart(List<DepartmentTaskCount> data) {
    if (data.isEmpty) return const Center(child: Text('Veri yok'));

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: (data.map((e) => e.count).reduce((a, b) => a > b ? a : b) * 1.2), // Find max Y
        barGroups: data.asMap().entries.map((entry) {
          final index = entry.key;
          final item = entry.value;
          return BarChartGroupData(
            x: index,
            barRods: [
              BarChartRodData(
                toY: item.count.toDouble(),
                color: Colors.lightBlue,
                width: 22,
              )
            ],
          );
        }).toList(),
        titlesData: FlTitlesData(
          // ... configure titles for X and Y axis ...
        ),
      ),
    );
  }

  Widget _buildTopPerformersList(List<TopPerformer> data) {
    if (data.isEmpty) return const Center(child: Text('Veri yok'));

    return Column(
      children: data.map((performer) => ListTile(
        leading: CircleAvatar(child: Text(performer.completedTasks.toString())),
        title: Text(performer.fullName),
        subtitle: Text('${performer.completedTasks} görev tamamladı'),
      )).toList(),
    );
  }

  Color _getColorForStatus(String status) {
    switch (status) {
      case 'NEW':
        return Colors.grey;
      case 'ASSIGNED':
        return Colors.blue;
      case 'IN_PROGRESS':
        return Colors.orange;
      case 'COMPLETED':
        return Colors.green;
      case 'CANCELLED':
        return Colors.red;
      default:
        return Colors.purple;
    }
  }
}