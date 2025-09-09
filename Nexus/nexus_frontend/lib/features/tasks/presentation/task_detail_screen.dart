// features/tasks/presentation/task_detail_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:nexus_frontend/features/tasks/data/models/task_model.dart';
import 'package:nexus_frontend/features/tasks/providers/task_providers.dart';
import 'package:nexus_frontend/features/tasks/data/task_repository.dart';

// Ekranımızı StatefulWidget'a çeviriyoruz çünkü içinde TextEditingController gibi
// state'ler yöneteceğiz ve dispose etmemiz gerekecek.
class TaskDetailScreen extends ConsumerStatefulWidget {
  final int taskId;
  const TaskDetailScreen({required this.taskId, super.key});

  @override
  ConsumerState<TaskDetailScreen> createState() => _TaskDetailScreenState();
}

class _TaskDetailScreenState extends ConsumerState<TaskDetailScreen> {
  final _commentController = TextEditingController();

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  // Yorum gönderme fonksiyonu
  void _submitComment() async {
    final content = _commentController.text.trim();
    if (content.isEmpty) return;

    // Butonu geçici olarak devre dışı bırakmak için bir state yönetimi eklenebilir.
    
    try {
      await ref.read(taskRepositoryProvider).addComment(widget.taskId, content);
      _commentController.clear();
      // Yorum gönderildikten sonra detayları manuel olarak yenilemeye gerek yok.
      // WebSocket'ten gelecek sinyal zaten invalidate edecek.
      // Ama anında geri bildirim için yine de yapılabilir.
      ref.invalidate(taskDetailProvider(widget.taskId));
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hata: Yorum eklenemedi. $e')),
      );
    }
  }

  // TODO: Dosya seçme ve yükleme fonksiyonu
  void _pickAndUploadFile() {
    // Bu kısım file_picker paketi ile implement edilecek.
  }

  @override
  Widget build(BuildContext context) {
    // WebSocket kanalını dinle. Gelen mesajlara göre aksiyon al.
    ref.listen<AsyncValue<dynamic>>(taskChannelProvider(widget.taskId), (previous, next) {
      next.when(
        data: (message) {
          print("WebSocket'ten yeni mesaj geldi: $message");

          // Provider'ı geçersiz kılarak ekranın API'dan en güncel veriyi çekmesini sağla.
          ref.invalidate(taskDetailProvider(widget.taskId));
          
          // Kullanıcıya küçük bir geri bildirim göster.
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Bu görevde yeni bir güncelleme var!'),
              duration: const Duration(seconds: 2),
            ),
          );
        },
        error: (err, stack) => print("WebSocket hatası: $err"),
        loading: () => print("WebSocket'e bağlanılıyor..."),
      );
    });

    final taskDetailAsyncValue = ref.watch(taskDetailProvider(widget.taskId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Görev Detayı'),
        actions: [
          // Veri başarıyla yüklendiğinde düzenle butonunu göster
          taskDetailAsyncValue.when(
            data: (task) => IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                // Düzenleme ekranına git, mevcut görevi parametre olarak gönder
                context.push('/tasks/${task.id}/edit', extra: task);
              },
            ),
            // Diğer durumlarda butonu gösterme
            loading: () => const SizedBox.shrink(),
            error: (_, __) => const SizedBox.shrink(),
          ),
        ],
      ),
      body: taskDetailAsyncValue.when(
        data: (task) => Column(
          children: [
            // Görev detayları ve yorumlar için kaydırılabilir alan
            Expanded(
              child: RefreshIndicator(
                onRefresh: () => ref.refresh(taskDetailProvider(widget.taskId).future),
                child: ListView(
                  padding: const EdgeInsets.all(16.0),
                  children: [
                    _buildTaskInfoSection(context, task),
                    const Divider(height: 32),
                    _buildCommentsSection(context, task.comments),
                    const Divider(height: 32),
                    _buildAttachmentsSection(context, task.attachments),
                  ],
                ),
              ),
            ),
            // Yorum yazma alanı
            _buildCommentInputField(),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text('Görev yüklenemedi: $err'),
          ),
        ),
      ),
    );
  }

  // --- Yardımcı Widget'lar ---

  // Görev ana bilgilerini gösteren bölüm
  Widget _buildTaskInfoSection(BuildContext context, Task task) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(task.title, style: Theme.of(context).textTheme.headlineSmall),
        const SizedBox(height: 16),
        Row(
          children: [
            Chip(label: Text('Durum: ${task.status}')),
            const SizedBox(width: 8),
            Chip(label: Text('Öncelik: ${task.priority}')),
          ],
        ),
        const SizedBox(height: 16),
        Text('Açıklama', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        Text(
          task.description?.isNotEmpty == true ? task.description! : 'Açıklama girilmemiş.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        // ... Diğer görev detayları buraya eklenebilir.
      ],
    );
  }

  // Yorumlar bölümü
  Widget _buildCommentsSection(BuildContext context, List<TaskComment> comments) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Yorumlar", style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        if (comments.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16.0),
            child: Text('Henüz yorum yok.'),
          )
        else
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: comments.length,
            itemBuilder: (context, index) {
              final comment = comments[index];
              return Card(
                margin: const EdgeInsets.symmetric(vertical: 4.0),
                child: ListTile(
                  title: Text(comment.content),
                  subtitle: Text(
                    '${comment.author.fullName} - ${DateFormat('dd.MM.yyyy HH:mm').format(comment.createdAt.toLocal())}',
                  ),
                ),
              );
            },
          ),
      ],
    );
  }

  // Ek dosyalar bölümü
  Widget _buildAttachmentsSection(BuildContext context, List<TaskAttachment> attachments) {
    // TODO: Bu bölümü daha sonra detaylandıracağız.
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Ek Dosyalar", style: Theme.of(context).textTheme.titleLarge),
        const SizedBox(height: 8),
        if (attachments.isEmpty)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16.0),
            child: Text('Henüz eklenmiş dosya yok.'),
          )
        else
          // ... Dosyaları listeleyecek widget'lar
          const Text('Dosya listesi burada görünecek.'),
      ],
    );
  }

  // Yorum giriş alanı
  Widget _buildCommentInputField() {
    return Material(
      elevation: 8,
      child: Padding(
        padding: EdgeInsets.only(
          left: 16,
          right: 8,
          top: 8,
          bottom: MediaQuery.of(context).padding.bottom + 8, // Klavye açıldığında boşluk bırak
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _commentController,
                decoration: const InputDecoration(
                  hintText: 'Yorumunuzu yazın...',
                  border: OutlineInputBorder(),
                  contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                onSubmitted: (_) => _submitComment(),
                maxLines: null, // Yorum uzadıkça alanın büyümesini sağlar
              ),
            ),
            IconButton(icon: const Icon(Icons.attach_file), onPressed: _pickAndUploadFile),
            IconButton(icon: const Icon(Icons.send), onPressed: _submitComment),
          ],
        ),
      ),
    );
  }
}