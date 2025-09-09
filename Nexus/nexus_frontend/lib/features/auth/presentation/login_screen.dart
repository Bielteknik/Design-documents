import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/core/storage/token_storage_service.dart';
import 'package:nexus_frontend/features/auth/data/auth_repository.dart';

// Bu ekranı bir ConsumerWidget yapıyoruz ki provider'ları dinleyebilsin.
class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final emailController = TextEditingController();
    final passwordController = TextEditingController();

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Nexus', style: Theme.of(context).textTheme.headlineMedium),
              const SizedBox(height: 20),
              TextField(controller: emailController, decoration: const InputDecoration(labelText: 'Email')),
              const SizedBox(height: 10),
              TextField(controller: passwordController, obscureText: true, decoration: const InputDecoration(labelText: 'Şifre')),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  // Butona basıldığında authRepository'deki login fonksiyonunu çağır
                  try {
                    final token = await ref.read(authRepositoryProvider).login(
                          emailController.text,
                          passwordController.text,
                        );
                    // TODO: Token'ı güvenli bir şekilde sakla (shared_preferences)
                    // TODO: Kullanıcıyı Dashboard ekranına yönlendir
                    await ref.read(tokenStorageProvider).saveTokens(
                          accessToken: token,
                          refreshToken: token,
                        );
                    print('Giriş başarılı! Token: $token');
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Giriş Başarılı!')),
                    );
                  } catch (e) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Hata: ${e.toString()}')),
                    );
                  }
                },
                child: const Text('Giriş Yap'),
              )
            ],
          ),
        ),
      ),
    );
  }
}