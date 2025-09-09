// features/tasks/data/task_repository.dart
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/core/api/dio_client.dart';
import 'package:nexus_frontend/features/tasks/data/models/task_model.dart';

class TaskRepository {
  final Dio _dio;
  TaskRepository(this._dio);

  Future<Task> getTaskById(int taskId) async {
    final response = await _dio.get('/operations/tasks/$taskId/');
    return Task.fromJson(response.data);
  }

  Future<List<Task>> getTasks() async {
    final response = await _dio.get('/operations/tasks/');
    return (response.data as List)
        .map((taskJson) => Task.fromJson(taskJson))
        .toList();
  }

  Future<Task> createTask({
    required String title,
    String? description,
    required String priority,
    int? assigneeId,
    int? departmentId,
  }) async {
    final response = await _dio.post(
      '/operations/tasks/',
      data: {
        'title': title,
        'description': description,
        'priority': priority,
        'assignee_id': assigneeId,
        'department_id': departmentId,
      },
    );
    return Task.fromJson(response.data);
  }

  Future<Task> updateTask(int taskId, Map<String, dynamic> data) async {
    final response = await _dio.patch('/operations/tasks/$taskId/', data: data);
    return Task.fromJson(response.data);
  }

  Future<Task> changeTaskStatus(int taskId, String newStatus) async {
    final response = await _dio.post(
      '/operations/tasks/$taskId/change-status/',
      data: {'status': newStatus},
    );
    return Task.fromJson(response.data);
  }

  Future<void> addComment(int taskId, String content) async {
    await _dio.post(
      '/operations/tasks/$taskId/comments/',
      data: {'content': content},
    );
  }

  Future<void> uploadAttachment(int taskId, File file) async {
    String fileName = file.path.split('/').last;
    FormData formData = FormData.fromMap({
      "file": await MultipartFile.fromFile(file.path, filename: fileName),
    });
    await _dio.post('/operations/tasks/$taskId/attachments/', data: formData);
  }

  // ... createTask, updateTask metodları da buraya eklenecek
}

// tasks provider'ları
final taskRepositoryProvider = Provider(
  (ref) => TaskRepository(ref.watch(dioProvider)),
);

final taskListProvider = FutureProvider<List<Task>>((ref) async {
  return ref.watch(taskRepositoryProvider).getTasks();
});
