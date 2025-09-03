## PROJE DOKÜMANTASYONU ve SİSTEM YOL HARİTASI

### *Versiyon 1.0 – Mayıs 2025*

---

## **🔖 1\. Doküman Bilgileri**

|       |       |
| ----- | ----- |
| Belge Adı | Kayak Merkezi Yönetimi Entegre Platformu (KM-YEP) – Sistem Dokümantasyonu |
| Versiyon | 1.0 |
| Hazırlayan | \[İsim Soyisim\] – Sistem Analisti |
| Onaylayan | \[İsim Soyisim\] – Proje Yöneticisi |
| Tarih | 05 Mayıs 2025 |
| Dağıtım | IT, Operasyon, İnsan Kaynakları, Finans, Üst Yönetim |
| Gizlilik | Kurumsal – Sadece İç Kullanım |

---

## **🧭 2\. Giriş**

### **2.1. Amaç**

Bu doküman, çoklu kayak merkezini yöneten bir kurumsal firmanın tüm operasyonel, idari ve stratejik süreçlerini tek bir platform altında toplayan "Kayak Merkezi Yönetimi Entegre Platformu (KM-YEP)" sistemini tanımlamak, kullanıcı ihtiyaçlarını karşılamak ve geliştirme sürecine temel oluşturmak amacıyla hazırlanmıştır.

### **2.2. Kapsam**

KM-YEP sistemi, aşağıdaki süreçleri kapsar:

* Kurum içi iletişim  
* Personel yönetimi  
* Görev takibi  
* Proje yönetimi  
* Merkez ve varlık yönetimi  
* Raporlama ve analitik

Sistem web tabanlı, çoklu kullanıcı rol destekli, gerçek zamanlı veri paylaşımına sahip olup, mobil uygulama olmadan masaüstü ve tablet cihazlarla kullanılmaktadır.

### **2.3. Hedef Kitle**

* Kurumsal yönetim  
* Bölge/Merkez müdürleri  
* Proje yöneticileri  
* İnsan kaynakları  
* Operasyonel personel (teknisyen, hizmet, güvenlik)  
* IT ve sistem yöneticileri

---

## **👥 3\. Kullanıcı Roller ve Yetkiler**

|       |       |       |       |
| ----- | ----- | ----- | ----- |
| Sistem Yöneticisi | Platformun teknik yönetiminden sorumlu | Tüm modüller | Kullanıcı oluşturma, rol atama, sistem ayarları, yedekleme |
| Genel / Bölge Müdürü | Stratejik karar verici, tüm merkezleri izler | Dashboard, Raporlama, Proje, Personel, İletişim | Performans analizi, proje onayı, duyuru |
| Merkez Müdürü | Belirli bir merkezin operasyonel sorumlusu | Görev, Personel, Merkez, İletişim | Görev atama, vardiya planlama, bakım takibi |
| Proje Yöneticisi | Stratejik projelerin yürütülmesinden sorumlu | Proje, Görev, Personel, İletişim | Gantt planlama, ekip yönetimi, raporlama |
| Personel | Operasyonel görevleri yürüten çalışan | Görev, İletişim, Personel (görüntüleme) | Görev tamamlama, mesajlaşma, eğitim talep etme |
| İnsan Kaynakları (HR) | Personel süreçlerini yönetir | Personel, İletişim | İşe alım, eğitim, performans değerlendirme |
| Finans / Muhasebe | Mali süreçleri takip eder | Personel (maaş), Proje (bütçe), Raporlama | Bordro, proje maliyet analizi |

---

## **🧩 4\. Sistem Modülleri**

|       |       |        |       |
| ----- | ----- | ------ | ----- |
| 1\. Kurum İçi İletişim | Güvenli, kayıtlı ve hızlı iletişim | Tüm kullanıcılar | Anlık mesajlaşma, grup sohbeti, duyuru panosu, bildirim sistemi |
| 2\. Personel Yönetimi  | İnsan kaynakları süreçlerinin dijitalleştirilmesi | HR, Yönetici, Personel | Personel bilgi sistemi, vardiya planlama, eğitim takibi, performans değerlendirme, işe alım  |
| 3\. Görev Yönetimi     | Operasyonel işlerin takibi ve yönetimi | Yönetici, Personel | Görev oluşturma, atama, öncelik belirleme, durum takibi, son tarih, bildirim |
| 4\. Proje Yönetimi     | Stratejik ve mevsimsel projelerin planlanması | Proje Yöneticisi, Yönetici | Proje planlama (Gantt), kaynak tahsisi, risk yönetimi, KPI takibi |
| 5\. Merkez & Varlık Yönetimi | Fiziksel varlıkların ve merkez bilgilerinin yönetimi | Merkez Müdürü, Teknisyen | Merkez profili, ekipman takibi, bakım planlama, arıza bildirimi, envanter |
| 6\. Raporlama & Analitik | Karar destek sistemi | Yönetici, Proje Yöneticisi | Canlı dashboard, özelleştirilebilir rapor, KPI, trend analizi |
| 7\. Sistem Yönetimi | Platformun teknik yapı ve güvenliğinin yönetimi | Sistem Yöneticisi | Kullanıcı yönetimi, log kaydı, yedekleme, entegrasyon ayarları |

---

## **🔗 5\. Modüller Arası Etkileşim**

1 \- Personel → Görev/Proje: Görev ve proje atamaları için temel veri kaynağıdır.

2 \- Merkez & Varlık → Görev: Bakım planı otomatik görev oluşturur.

3

4

5

Modül Etkileşimi:





\- Görev → İletişim: Görev ataması/bildirim sistemi ile yöneticilere ve personele bilgi gider.

\- Tüm Modüller → Raporlama: Veriler merkezi dashboard ve raporlarda toplanır.

---

## **🧭 6\. Kullanıcı Akışı ve Senaryolar**

### **6.1. Yönetici Senaryosu: Operasyonel Müdahale**

|  |  |  |  |
| ----- | ----- | ----- | ----- |
| 08:30 | Giriş ve Dashboard | Dashboard | Bölge Müdürü, tüm merkezlerin performansını inceler |
| 08:45 | Sorun Tespiti | Görev Modülü | Karaburun’da "Telesiyej B Bakımı" görevinin geciktiğini görür |
| 09:00 | Müdahale | Görev Modülü | Görevi Ahmet’e yeniden atar, önceliği "Acil" yapar |
| 09:15 | Bilgilendirme | İletişim | "Telesiyej geçici kapanış" duyurusu yayınlar |
| 10:00 | Raporlama | Raporlama | Aylık performans raporunu PDF olarak indirir |

---

### **6.2. Personel Senaryosu: Görev Tamamlama**

|  |  |  |  |
| ----- | ----- | ----- | ----- |
| 07:45 | Giriş | Giriş Ekranı | Ahmet, km-yep.com adresine girer, giriş yapar |
| 08:00 | Görev Başlatma | Görev Modülü | "Telesiyej B Bakımı" görevini başlatır |
| 10:30 | Gerçek İşlem | — | Motor yağ değişimi gerçekleştirir |
| 11:00 | Rapor Gönderme | Görev Modülü | Fotoğraf, not ve kontrol listesi ile görevi tamamlar |
| 11:15 | İletişim | İletişim | Arkadaşına mesaj atarak koordinasyon sağlar |
| 11:30 | Eğitim Talebi | Personel \> Eğitim | "Güvenlik Protokolleri" eğitimi için talep oluşturur |

---

## **🖥️ 7\. Web Arayüzü Yapısı**

### **7.1. Genel Arayüz Tasarımı**

1

2

3

4

5

6

7

8

9

10

11

\+-----------------------------------------------------------------------------+

| 🎿 KM-YEP | Hoş geldiniz, \[Kullanıcı\] | \[Rol\] | 🔔 \[3\] | 🔍 Ara | \[Profil ▼\]  |

\+-----------------------------------------------------------------------------+

| 🏠 Ana Sayfa  | 📋 Görevler  | 🧑‍💼 Personel  | 📂 Projeler  | 💬 İletişim  | 📊 Raporlar |

\+-----------------------------------------------------------------------------+

|                                                                             |

|                         \[DİNAMİK İÇERİK BURADA\]                             |

|                                                                             |

\+-----------------------------------------------------------------------------+

| 📞 Destek | 🛠️ Ayarlar | 📄 Kılavuz | © 2025 Alpina Kayak Merkezleri A.Ş.     |

\+-----------------------------------------------------------------------------+

### **7.2. Tasarım İlkeleri**

* İş odaklı arayüz: Az renk, net içerik, yüksek okunabilirlik  
* Responsive tasarım: Masaüstü, laptop, tablet uyumlu  
* Erişilebilirlik: WCAG 2.1 uyumlu (kontrast, font boyutu, ekran okuyucu)  
* Hızlı erişim: Sol menüde modüller, üstte bildirim ve arama

---

## **🗓️ 8\. Zaman Çizelgesi ve Mevsimsel Kullanım**

|  |  |  |  |
| ----- | ----- | ----- | ----- |
| Kış (Aralık \- Nisan) | Operasyon Zirvesi | Görev, İletişim, Personel, Merkez | Günlük görevler, yoğun personel vardiya, bakım |
| İlkbahar (Mayıs \- Haziran) | Sezon Sonu Analizi | Raporlama, Personel, Proje | Performans değerlendirme, yazlık proje planlama |
| Yaz (Temmuz \- Eylül) | Bakım ve Yenileme | Proje, Merkez, Görev | Ekipman yenileme, bakım projeleri |
| Sonbahar (Ekim \- Kasım) | Hazırlık ve İşe Alım | Personel, İletişim, Görev | Yeni personel eğitimi, vardiya planlama |

---

## **📊 9\. Veri Akışı ve Entegrasyonlar**

|  |  |  |  |
| ----- | ----- | ----- | ----- |
| Görev Modülü | Raporlama | Tamamlanan görev sayısı | Gerçek zamanlı |
| Personel Modülü | Görev | Personel bilgisi, yük durumu | Anlık |
| Merkez Modülü | Görev | Bakım planı → Görev | Otomatik (takvim bazlı) |
| Proje Modülü | Personel | Proje ekibi → Vardiya | Manuel / Onaylı |
| Finans | Personel | Maaş bilgisi | Aylık (entegrasyonla) |
| Harici E-Posta | İletişim | Dış mesajlaşma | SMTP entegrasyonu |

---

## **✅ 10\. Beklenen Faydalar**

|  |  |
| ----- | ----- |
| Operasyonel Verim | Görev tamamlama oranı %95’e çıkar |
| İletişim Kalitesi | Kağıt/telefon ile iletişim kaybı %80 azalır |
| Personel Memnuniyeti | Vardiya dengesi ile iş doyumu artar |
| Karar Verme Hızı | Gerçek zamanlı veri ile yönetim kararı 70% hızlanır |
| Maliyet Kontrolü | Bakım gecikmesi azalır, ekipman ömrü uzar |
| Ölçeklenebilirlik | Yeni merkez entegrasyonu 1 haftada tamamlanır |

---

## **🚀 11\. Geliştirme Yol Haritası (Roadmap)**

|  |  |  |  |
| ----- | ----- | ----- | ----- |
| 1\. Analiz ve Tasarım | 4 hafta | Kullanıcı görüşmeleri, UI/UX tasarımı | Figma mockup, kullanıcı akışı |
| 2\. Temel Modüller | 8 hafta | Görev, İletişim, Personel geliştirilir | Beta sürüm (1 merkez test) |
| 3\. İleri Modüller | 6 hafta | Proje, Merkez, Raporlama | Gantt, dashboard, bakım planlama |
| 4\. Test ve Eğitim | 3 hafta | Kullanıcı testi, eğitim videoları | Kullanım kılavuzu, test raporu |
| 5\. Yayına Alma | 1 hafta | Tüm merkezlere entegrasyon | Canlı sistem, 7/24 destek |
| 6\. Sürekli Geliştirme | Devam | Yeni özellikler, iyileştirmeler | Güncelleme döngüsü (3 ayda bir) |

---

## **📌 12\. Sonuç**

KM-YEP sistemi, kurumsal bir kayak merkezi işletmecisinin tüm süreçlerini tek çatı altında, şeffaf, izlenebilir ve karar destekli bir şekilde yönetmesini sağlar. Web tabanlı yapısı ile mobil uygulama gereksinimi olmadan, ofis ve saha çalışanlarının etkin kullanımına olanak tanır.

Bu sistem sayesinde:

* İletişim kaybı ortadan kalkar,  
* Görevler takip edilebilir hale gelir,  
* Personel yönetimi dijitalleşir,  
* Stratejik planlama veriye dayalı hale gelir.

