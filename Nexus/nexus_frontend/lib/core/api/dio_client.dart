import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/core/storage/token_storage_service.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(
    baseUrl: 'http://127.0.0.1:8000/api',
  ));

  // Interceptor'ı ekliyoruz
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Her istekten önce, sakladığımız token'ı alıyoruz
        final token = await ref.read(tokenStorageProvider).getAccessToken();
        if (token != null) {
          // Eğer token varsa, 'Authorization' başlığına ekliyoruz
          options.headers['Authorization'] = 'Bearer $token';
        }
        // İsteğin devam etmesini sağlıyoruz
        return handler.next(options);
      },
      onError: (DioException e, handler) async {
        // TODO: Eğer 401 (Unauthorized) hatası alırsak, 
        // refresh token kullanarak yeni bir access token almayı dene.
        // Bu daha ileri bir konu, şimdilik pas geçiyoruz.
        return handler.next(e);
      },
    ),
  );
  return dio;
});