// app/router.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:nexus_frontend/features/auth/presentation/login_screen.dart';
import 'package:nexus_frontend/features/dashboard/presentation/dashboard_screen.dart';
import 'package:nexus_frontend/features/auth/providers/auth_state_provider.dart';
import 'package:nexus_frontend/features/tasks/data/models/task_model.dart';
import 'package:nexus_frontend/features/tasks/presentation/task_form_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  // Auth durumundaki değişiklikleri dinle
  final authState = ref.watch(authStateProvider);

  return GoRouter(
    // Her navigasyon değişikliğinde tetiklenir
    redirect: (context, state) {
      // Eğer auth durumu henüz belli değilse (uygulama yeni açıldıysa)
      if (authState == AuthStatus.unknown) {
        return null; // Hiçbir şey yapma, bekle
      }

      final isLoggedIn = authState == AuthStatus.authenticated;
      final isLoggingIn = state.matchedLocation == '/login';

      // Eğer kullanıcı giriş yapmışsa ve login sayfasına gitmeye çalışıyorsa,
      // onu ana sayfaya yönlendir.
      if (isLoggedIn && isLoggingIn) {
        return '/';
      }
      // Eğer kullanıcı giriş yapmamışsa ve login sayfası dışında bir yere
      // gitmeye çalışıyorsa, onu login sayfasına yönlendir.
      if (!isLoggedIn && !isLoggingIn) {
        return '/login';
      }

      return null; // Diğer durumlarda yönlendirme yapma
    },
    routes: [
      GoRoute(path: '/', builder: (context, state) => const DashboardScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
      GoRoute(
        path: '/tasks/:taskId/edit',
        builder: (context, state) {
          // Navigasyon sırasında 'extra' ile gönderilen task nesnesini alıyoruz
          final task = state.extra as Task?;
          return TaskFormScreen(initialTask: task);
        },
      ),
    ],
  );
});
