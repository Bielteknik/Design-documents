import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/app/router.dart'; // router'ımızı import ediyoruz

class NexusApp extends ConsumerWidget {
  const NexusApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // routerProvider'ı dinleyerek GoRouter nesnesini alıyoruz
    final router = ref.watch(routerProvider);

    // MaterialApp.router kullanarak uygulamamızı yönlendirme sistemiyle kuruyoruz
    return MaterialApp.router(
      title: 'Nexus',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      // Yönlendirme yapılandırmasını GoRouter'dan alıyoruz
      routerConfig: router,
    );
  }
}