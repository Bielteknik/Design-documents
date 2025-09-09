// features/auth/providers/auth_state_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:nexus_frontend/core/storage/token_storage_service.dart';

// Enum ile olası kimlik doğrulama durumlarını tanımlıyoruz
enum AuthStatus { unknown, authenticated, unauthenticated }

// Bu provider, uygulama boyunca mevcut kimlik durumunu tutar
final authStateProvider = StateNotifierProvider<AuthStateNotifier, AuthStatus>((ref) {
  return AuthStateNotifier(ref.read(tokenStorageProvider));
});

class AuthStateNotifier extends StateNotifier<AuthStatus> {
  final TokenStorageService _tokenStorageService;

  AuthStateNotifier(this._tokenStorageService) : super(AuthStatus.unknown) {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final token = await _tokenStorageService.getAccessToken();
    if (token != null) {
      state = AuthStatus.authenticated;
    } else {
      state = AuthStatus.unauthenticated;
    }
  }

  Future<void> login() async {
    // Başarılı giriş sonrası durumu güncelle
    state = AuthStatus.authenticated;
  }

  Future<void> logout() async {
    await _tokenStorageService.clearTokens();
    state = AuthStatus.unauthenticated;
  }
}

// Giriş yapmış kullanıcının yetkilerini tutan basit bir provider
final userPermissionsProvider = StateProvider<Set<String>>((ref) {
  // TODO: Auth state değiştiğinde bu provider'ı kullanıcının
  // yetkileriyle doldur.
  return {};
});