# 🚀 Django Backend Geçiş Kılavuzu

ejder3200hub projesini Express.js'den Django'ya geçiş kılavuzu.

## 📋 Geçiş Özeti

### Mevcut Durum (Express.js)
- Port: 3001
- PostgreSQL veritabanı
- Prisma ORM
- 7 adet route dosyası
- 13 adet model

### Yeni Durum (Django)
- Port: 8000 (varsayılan)
- Aynı PostgreSQL veritabanı
- Django ORM
- 5 adet Django app
- Django REST Framework API

## 🛠️ Kurulum Adımları

### 1. Python ve Sanal Ortam Kurulumu

```powershell
# Python'un yüklü olduğunu kontrol edin
python --version

# backend_django dizinine gidin
cd "backend_django"

# PowerShell kurulum script'ini çalıştırın
.\setup_django.ps1
```

### 2. Manuel Kurulum (Alternatif)

```powershell
# Sanal ortam oluşturun
python -m venv venv

# Sanal ortamı etkinleştirin
.\venv\Scripts\Activate.ps1

# Bağımlılıkları yükleyin
pip install -r requirements.txt

# Django migration'larını oluşturun
python manage.py makemigrations

# Veritabanı migration'larını uygulayın
python manage.py migrate

# Django superuser oluşturun (opsiyonel)
python manage.py createsuperuser

# Static dosyaları toplayın
python manage.py collectstatic --noinput
```

### 3. Django Sunucusunu Başlatın

```powershell
# Development server'ı başlatın
python manage.py runserver 0.0.0.0:8000
```

## 🔧 Frontend Güncellemesi

### API Service Değişikliği

Mevcut `apiService.ts` dosyasını yedekleyin ve yeni Django API service'ini kullanın:

```typescript
// services/apiService.ts dosyasında
import { djangoApiService as apiService } from './apiService_django';

// VEYA mevcut dosyayı yenisiyle değiştirin
```

### URL Değişiklikleri

- **Eski Express.js**: `http://localhost:3001/api`
- **Yeni Django**: `http://localhost:8000/api/v1`

## 📊 API Endpoint Karşılaştırması

| Kaynak | Express.js | Django |
|--------|------------|---------|
| Projeler | `/api/projects` | `/api/v1/projects/` |
| Görevler | `/api/tasks` | `/api/v1/tasks/` |
| Kaynaklar | `/api/resources` | `/api/v1/resources/` |
| Fikirler | `/api/ideas` | `/api/v1/ideas/` |
| Etkinlikler | `/api/events` | `/api/v1/events/` |
| Yorumlar | `/api/comments` | `/api/v1/comments/` |
| Departmanlar | `/api/departments` | `/api/v1/departments/` |

## 🆕 Django'nun Yeni Özellikleri

### 1. Admin Interface
Django admin paneline erişim: `http://localhost:8000/admin/`

### 2. Gelişmiş API Özellikleri
- **Pagination**: Otomatik sayfalama
- **Filtering**: URL parameter'ları ile filtreleme
- **Search**: `?search=query` ile arama
- **Ordering**: `?ordering=field` ile sıralama

### 3. Ek Endpoint'ler

#### Resources
- `/api/v1/resources/by_role/` - Role göre gruplandırılmış kaynaklar
- `/api/v1/resources/managers/` - Sadece yönetici seviyesi kaynaklar

#### Projects
- `/api/v1/projects/statistics/` - Proje istatistikleri
- `/api/v1/projects/{id}/tasks/` - Belirli projenin görevleri
- `/api/v1/projects/{id}/update_progress/` - Proje ilerlemesi güncelleme

#### Tasks
- `/api/v1/tasks/my_tasks/?assignee_id={id}` - Kullanıcının görevleri
- `/api/v1/tasks/statistics/` - Görev istatistikleri

#### Departments
- `/api/v1/departments/hierarchy/` - Departman hiyerarşisi

## 🔄 Geçiş Stratejisi

### Paralel Çalıştırma (Önerilen)
1. Django backend'i port 8000'de çalıştırın
2. Express.js backend'i port 3001'de çalışır durumda bırakın
3. Frontend'de yavaş yavaş endpoint'leri Django'ya yönlendirin
4. Test tamamlandıktan sonra Express.js'i kapatın

### Doğrudan Geçiş
1. Express.js backend'i durdurun
2. Frontend'deki `apiService.ts`'yi güncelleyin
3. Django backend'i başlatın

## 🧪 Test Etme

### API Test'leri
```bash
# Temel API test'i
curl http://localhost:8000/api/

# Projeler listesi
curl http://localhost:8000/api/v1/projects/

# Kaynaklar listesi
curl http://localhost:8000/api/v1/resources/
```

### Admin Panel Test'i
1. `http://localhost:8000/admin/` adresine gidin
2. Superuser bilgileri ile giriş yapın
3. Modelleri görüntüleyin ve düzenleyin

## 📈 Django'nun Avantajları

### 1. Güçlü Admin Interface
- Otomatik CRUD operasyonları
- Gelişmiş filtreleme ve arama
- Bulk işlemler
- Kullanıcı yönetimi

### 2. Django REST Framework
- Otomatik API dokümantasyonu
- Serialization/Deserialization
- Permission sistemi
- Throttling ve rate limiting

### 3. Django ORM
- Güçlü query builder
- Migration sistemi
- Database relationship'leri
- Multi-database desteği

### 4. Güvenlik
- Built-in CSRF koruması
- SQL injection koruması
- XSS koruması
- Secure headers

### 5. Scalability
- Production-ready
- Caching sistemi
- Load balancing desteği
- Async view desteği

## 🚨 Dikkat Edilmesi Gerekenler

### 1. URL Formatları
Django REST Framework URL'leri sonunda `/` ile bitiyor

### 2. Response Formatları
Django pagination response'ları:
```json
{
  "count": 10,
  "next": "url",
  "previous": "url", 
  "results": [...]
}
```

### 3. Error Handling
Django error response'ları farklı format kullanıyor

### 4. Environment Variables
Django `.env` dosyası farklı değişkenler kullanıyor

## 📝 Sonraki Adımlar

1. **Authentication & Authorization**: Django'nun user sistemi ile entegrasyon
2. **Caching**: Redis ile caching implementasyonu
3. **Testing**: Django test framework ile unit test'ler
4. **Documentation**: Django REST Framework auto-documentation
5. **Deployment**: Production deployment konfigürasyonu

## 💡 Faydalı Komutlar

```powershell
# Django shell (interactive Python)
python manage.py shell

# Django migration durumu
python manage.py showmigrations

# Yeni migration oluşturma
python manage.py makemigrations

# Migration uygulama
python manage.py migrate

# Superuser oluşturma
python manage.py createsuperuser

# Static dosyaları toplama
python manage.py collectstatic

# Development server başlatma
python manage.py runserver 0.0.0.0:8000
```