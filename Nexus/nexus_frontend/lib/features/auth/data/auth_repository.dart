import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/core/api/dio_client.dart';

class AuthRepository {
  final Dio _dio;
  AuthRepository(this._dio);

  Future<String> login(String email, String password) async {
    try {
      final response = await _dio.post('/auth/token/', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        // Başarılı girişte access token'ı döndür
        return response.data['access'];
      } else {
        throw Exception('Giriş başarısız.');
      }
    } catch (e) {
      // Hata yönetimi burada yapılacak
      throw Exception('Bir hata oluştu: $e');
    }
  }
}

// Bu repository'yi uygulama genelinde kullanılabilir yapan provider
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(dioProvider));
});