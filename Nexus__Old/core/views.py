from django.urls import path, reverse_lazy
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, f"Hoşgeldiniz, {user.username}!")
            return redirect('dashboard_analytic') # Başarılı giriş sonrası yönlendirme
        else:
            messages.error(request, 'Hatalı kullanıcı adı veya şifre.')
            return render(request, 'login.html')
    else:
        return render(request, 'login.html')

@login_required # Sadece giriş yapmış kullanıcılar erişebilir
def dashboard_analytic(request):
    # base.html'e gönderilecek örnek veriler (dinamik hale getirilebilir)
    context = {
        'notification_count': 4,
        'messages_count': 561,
        'tasks_count': 920,
        'notes_count': '23B', # Orjinaldeki gibi bıraktım, dinamikleştirilebilir
        'page_title': 'Analitik Dashboard',
        'breadcrumb': [
            {'name': 'Analitik Dashboard', 'url': '#'}
        ]
    }
    return render(request, 'base.html', context)

@login_required
def user_logout(request):
    logout(request)
    messages.info(request, "Güvenli bir şekilde oturumunuz kapatıldı.")
    return redirect('login')

# Diğer dashboard ve uygulama sayfaları için placeholder'lar (base.html'de tanımladığımız url'lere karşılık gelecekler)
# Bu fonksiyonları daha sonra gerçek içeriklerle doldurabilirsiniz
@login_required
def home_view(request):
    return redirect('dashboard_analytic') # Ana sayfa doğrudan analitik dashboard'a yönlendirsin

@login_required
def profile_view(request):
    return render(request, 'base.html', {'page_title': 'Profilim', 'breadcrumb': [{'name': 'Profilim', 'url': '#'}]})

@login_required
def inbox_view(request):
    return render(request, 'base.html', {'page_title': 'Gelen Kutusu', 'breadcrumb': [{'name': 'Gelen Kutusu', 'url': '#'}]})

@login_required
def settings_view(request):
    return render(request, 'base.html', {'page_title': 'Ayarlar', 'breadcrumb': [{'name': 'Ayarlar', 'url': '#'}]})

# Dashboard Alt Menüleri
@login_required
def dashboard_management(request):
    return render(request, 'base.html', {'page_title': 'Yönetim Dashboard', 'breadcrumb': [{'name': 'Yönetim', 'url': '#'}]})

@login_required
def dashboard_social(request):
    return render(request, 'base.html', {'page_title': 'Sosyal Tesisler Dashboard', 'breadcrumb': [{'name': 'Sosyal Tesisler', 'url': '#'}]})

@login_required
def dashboard_technical(request):
    return render(request, 'base.html', {'page_title': 'Teknik Birim Dashboard', 'breadcrumb': [{'name': 'Teknik Birim', 'url': '#'}]})

@login_required
def dashboard_innovation(request):
    return render(request, 'base.html', {'page_title': 'İnovasyon Merkezi Dashboard', 'breadcrumb': [{'name': 'İnovasyon Merkezi', 'url': '#'}]})


# Birimler Alt Menüleri
@login_required
def unit_hr(request):
    return render(request, 'base.html', {'page_title': 'İnsan Kaynakları', 'breadcrumb': [{'name': 'Birimler', 'url': '#'}, {'name': 'İnsan Kaynakları', 'url': '#'}]})

@login_required
def unit_accounting(request):
    return render(request, 'base.html', {'page_title': 'Muhasebe & Finans', 'breadcrumb': [{'name': 'Birimler', 'url': '#'}, {'name': 'Muhasebe & Finans', 'url': '#'}]})

@login_required
def unit_sales_marketing(request):
    return render(request, 'base.html', {'page_title': 'Satış Pazarlama', 'breadcrumb': [{'name': 'Birimler', 'url': '#'}, {'name': 'Satış Pazarlama', 'url': '#'}]})

@login_required
def unit_purchasing(request):
    return render(request, 'base.html', {'page_title': 'Satın Alma', 'breadcrumb': [{'name': 'Birimler', 'url': '#'}, {'name': 'Satın Alma', 'url': '#'}]})

@login_required
def unit_recreation(request):
    return render(request, 'base.html', {'page_title': 'Rekreasyon', 'breadcrumb': [{'name': 'Birimler', 'url': '#'}, {'name': 'Rekreasyon', 'url': '#'}]})

@login_required
def unit_it(request):
    return render(request, 'base.html', {'page_title': 'Bilgi İşlem', 'breadcrumb': [{'name': 'Birimler', 'url': '#'}, {'name': 'Bilgi İşlem', 'url': '#'}]})

@login_required
def unit_software_dev(request):
    return render(request, 'base.html', {'page_title': 'Yazılım Geliştirme', 'breadcrumb': [{'name': 'Birimler', 'url': '#'}, {'name': 'Yazılım Geliştirme', 'url': '#'}]})


# Sosyal Tesisler Alt Menüleri
@login_required
def facility_accommodation(request):
    return render(request, 'base.html', {'page_title': 'Konaklama', 'breadcrumb': [{'name': 'Sosyal Tesisler', 'url': '#'}, {'name': 'Konaklama', 'url': '#'}]})

@login_required
def facility_restaurants(request):
    return render(request, 'base.html', {'page_title': 'Restoran & Kafeler', 'breadcrumb': [{'name': 'Sosyal Tesisler', 'url': '#'}, {'name': 'Restoran & Kafeler', 'url': '#'}]})

@login_required
def facility_ticket_sales(request):
    return render(request, 'base.html', {'page_title': 'Bilet Satış', 'breadcrumb': [{'name': 'Sosyal Tesisler', 'url': '#'}, {'name': 'Bilet Satış', 'url': '#'}]})


# Teknik Birim Alt Menüleri
@login_required
def technical_construction(request):
    return render(request, 'base.html', {'page_title': 'Yapı & İnşaat', 'breadcrumb': [{'name': 'Teknik Birim', 'url': '#'}, {'name': 'Yapı & İnşaat', 'url': '#'}]})

@login_required
def technical_energy(request):
    return render(request, 'base.html', {'page_title': 'Enerji Sistemleri', 'breadcrumb': [{'name': 'Teknik Birim', 'url': '#'}, {'name': 'Enerji Sistemleri', 'url': '#'}]})

@login_required
def technical_machine(request):
    return render(request, 'base.html', {'page_title': 'Makina Sistemleri', 'breadcrumb': [{'name': 'Teknik Birim', 'url': '#'}, {'name': 'Makina Sistemleri', 'url': '#'}]})

@login_required
def technical_hvac(request):
    return render(request, 'base.html', {'page_title': 'HVAC Sistemleri', 'breadcrumb': [{'name': 'Teknik Birim', 'url': '#'}, {'name': 'HVAC Sistemleri', 'url': '#'}]})


# Uygulamalar Alt Menüleri
@login_required
def app_calendar(request):
    context = {
        'page_title': 'Ajanda',
        'breadcrumb': [
            {'name': 'Uygulamalar', 'url': '#'},
            {'name': 'Ajanda', 'url': '#'}
        ]
        # Gerçek etkinlik verilerini buradan gönderebilirsiniz:
        # 'events_json': json.dumps(your_events_from_db_list)
    }
    return render(request, 'app-calendar.html', context)

@login_required
def app_chat(request):
    return render(request, 'base.html', {'page_title': 'Sohbet', 'breadcrumb': [{'name': 'Uygulamalar', 'url': '#'}, {'name': 'Sohbet', 'url': '#'}]})

@login_required
def app_taskboard(request):
    return render(request, 'base.html', {'page_title': 'Görev Tahtası', 'breadcrumb': [{'name': 'Uygulamalar', 'url': '#'}, {'name': 'Görev Tahtası', 'url': '#'}]})

@login_required
def app_contact(request):
    return render(request, 'base.html', {'page_title': 'Kişiler', 'breadcrumb': [{'name': 'Uygulamalar', 'url': '#'}, {'name': 'Kişiler', 'url': '#'}]})

@login_required
def file_dashboard(request):
    return render(request, 'base.html', {'page_title': 'Dosya Yöneticisi', 'breadcrumb': [{'name': 'Uygulamalar', 'url': '#'}, {'name': 'Dosya Yöneticisi', 'url': '#'}]})

@login_required
def file_documents(request):
    return render(request, 'base.html', {'page_title': 'Belgeler', 'breadcrumb': [{'name': 'Uygulamalar', 'url': '#'}, {'name': 'Dosya Yöneticisi', 'url': '#'}, {'name': 'Belgeler', 'url': '#'}]})

@login_required
def file_media(request):
    return render(request, 'base.html', {'page_title': 'Medya', 'breadcrumb': [{'name': 'Uygulamalar', 'url': '#'}, {'name': 'Dosya Yöneticisi', 'url': '#'}, {'name': 'Medya', 'url': '#'}]})

@login_required
def file_images(request):
    return render(request, 'base.html', {'page_title': 'Görseller', 'breadcrumb': [{'name': 'Uygulamalar', 'url': '#'}, {'name': 'Dosya Yöneticisi', 'url': '#'}, {'name': 'Görseller', 'url': '#'}]})


# Araçlar Alt Menüleri
@login_required
def widgets_weather(request):
    return render(request, 'base.html', {'page_title': 'Hava Durumu', 'breadcrumb': [{'name': 'Araçlar', 'url': '#'}, {'name': 'Hava Durumu', 'url': '#'}]})

@login_required
def widgets_blog(request):
    return render(request, 'base.html', {'page_title': 'Birim Çevirici', 'breadcrumb': [{'name': 'Araçlar', 'url': '#'}, {'name': 'Birim Çevirici', 'url': '#'}]})

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            messages.success(request, f"Hesabınız başarıyla oluşturuldu, {user.username}. Giriş yapabilirsiniz.")
            return redirect('login') # Kayıt sonrası giriş sayfasına yönlendir
        else:
            # Form geçersizse, hataları template'e gönder
            for field in form:
                for error in field.errors:
                    messages.error(request, f"{field.label}: {error}")
            for error in form.non_field_errors():
                messages.error(request, error)
            return render(request, 'register.html', {'form': form})
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})