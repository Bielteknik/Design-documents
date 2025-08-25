from django.shortcuts import render

# Ana dashboard sayfasını gösterir
def dashboard_view(request):
    return render(request, 'base.html')

# İnovasyon sayfasını gösterir
def inovasyon_view(request):
    return render(request, 'inovasyon_page.html')

# Asistan & Ajanda gösterir
def agenda_view(request):
    return render(request, 'agenda_page.html')
