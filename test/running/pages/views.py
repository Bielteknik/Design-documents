from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required

# Kullanıcı giriş view'ı
def login_view(request):
    # Eğer kullanıcı zaten giriş yapmışsa, dashboard'a yönlendir
    if request.user.is_authenticated:
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('dashboard') # Başarılı girişte dashboard'a yönlendir
    else:
        form = AuthenticationForm()
        
    return render(request, 'login.html', {'form': form})

# Kullanıcı çıkış view'ı
def logout_view(request):
    logout(request)
    return redirect('login') # Çıkış yapınca login sayfasına yönlendir

# @login_required dekoratörü bu sayfanın sadece giriş yapmış kullanıcılar tarafından görülmesini sağlar
@login_required
def dashboard_view(request):
    # base.html yerine dashboard.html adında ayrı bir dosya kullanmak daha mantıklı
    return render(request, 'dashboard.html')

@login_required
def inovasyon_view(request):
    return render(request, 'inovasyon_page.html')

@login_required
def agenda_view(request):
    return render(request, 'agenda_page.html')