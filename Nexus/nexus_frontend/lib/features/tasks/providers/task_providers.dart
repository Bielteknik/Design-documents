import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/features/tasks/data/models/task_model.dart';
import 'package:nexus_frontend/features/tasks/data/task_repository.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

final taskDetailProvider = FutureProvider.family<Task, int>((ref, taskId) async {
  return ref.watch(taskRepositoryProvider).getTaskById(taskId);
});

final taskChannelProvider = StreamProvider.family<dynamic, int>((ref, taskId) {
  // TODO: Token'ı alıp URL'e eklemek gerekebilir (güvenlik için)
  final channel = WebSocketChannel.connect(
    Uri.parse('ws://127.0.0.1:8000/ws/tasks/$taskId/'),
  );
  
  // Provider dispose olduğunda kanalın kapanmasını sağla
  ref.onDispose(() => channel.sink.close());

  return channel.stream;
});