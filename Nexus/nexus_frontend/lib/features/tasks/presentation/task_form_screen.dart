// features/tasks/presentation/task_form_screen.dart (Dosya adını değiştirdik)
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/features/tasks/data/models/task_model.dart';
import 'package:nexus_frontend/features/tasks/data/task_repository.dart';
import 'package:nexus_frontend/features/tasks/providers/task_providers.dart';
// ... diğer importlar

class TaskFormScreen extends ConsumerStatefulWidget {
  // Düzenleme modunda isek, mevcut görev buraya gelecek.
  final Task? initialTask; 
  
  const TaskFormScreen({super.key, this.initialTask});

  @override
  ConsumerState<TaskFormScreen> createState() => _TaskFormScreenState();
}

class _TaskFormScreenState extends ConsumerState<TaskFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  String _selectedPriority = 'NORMAL';
  
  bool get isEditMode => widget.initialTask != null;

  @override
  void initState() {
    super.initState();
    final task = widget.initialTask;
    _titleController = TextEditingController(text: task?.title ?? '');
    _descriptionController = TextEditingController(text: task?.description ?? '');
    _selectedPriority = task?.priority ?? 'NORMAL';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isEditMode ? 'Görevi Düzenle' : 'Yeni Görev Oluştur'),
      ),
      body: Form(
        key: _formKey,
        // ... (Form içeriği CreateTaskScreen ile aynı kalabilir) ...
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
             children: [
                TextFormField(
                  controller: _titleController,
                  decoration: const InputDecoration(labelText: 'Görev Başlığı'),
                  validator: (value) => (value == null || value.isEmpty) ? 'Başlık boş olamaz' : null,
                ),
                // ... Diğer form alanları
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _submitForm,
                  child: const Text('Kaydet'),
                ),
             ],
          )
        )
      ),
    );
  }

  void _submitForm() async {
    if (_formKey.currentState!.validate()) {
      try {
        if (isEditMode) {
          // --- Düzenleme Mantığı ---
          await ref.read(taskRepositoryProvider).updateTask(
            widget.initialTask!.id, 
            {
              'title': _titleController.text,
              'description': _descriptionController.text,
              'priority': _selectedPriority,
            }
          );
        } else {
          // --- Oluşturma Mantığı ---
          await ref.read(taskRepositoryProvider).createTask(
            title: _titleController.text,
            description: _descriptionController.text,
            priority: _selectedPriority,
          );
        }

        // State'i yenile ve geri dön
        ref.invalidate(taskListProvider);
        if (isEditMode) {
          ref.invalidate(taskDetailProvider(widget.initialTask!.id));
        }
        
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Görev başarıyla ${isEditMode ? 'güncellendi' : 'oluşturuldu'}!')));

      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Hata: $e')));
      }
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }
}