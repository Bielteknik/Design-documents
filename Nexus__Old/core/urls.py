from django.urls import path, reverse_lazy
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.home_view, name='home'), # Ana dizin için yönlendirme
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('dashboard/analytic/', views.dashboard_analytic, name='dashboard_analytic'),
    path('register/', views.register_view, name='register'),
    
    # Diğer dashboard görünümleri
    path('dashboard/management/', views.dashboard_management, name='dashboard_management'),
    path('dashboard/social/', views.dashboard_social, name='dashboard_social'),
    path('dashboard/technical/', views.dashboard_technical, name='dashboard_technical'),
    path('dashboard/innovation/', views.dashboard_innovation, name='dashboard_innovation'),

    # Kullanıcı Menüleri
    path('profile/', views.profile_view, name='profile'),
    path('inbox/', views.inbox_view, name='inbox'),
    path('settings/', views.settings_view, name='settings'),

    # Birimler
    path('units/hr/', views.unit_hr, name='unit_hr'),
    path('units/accounting/', views.unit_accounting, name='unit_accounting'),
    path('units/sales-marketing/', views.unit_sales_marketing, name='unit_sales_marketing'),
    path('units/purchasing/', views.unit_purchasing, name='unit_purchasing'),
    path('units/recreation/', views.unit_recreation, name='unit_recreation'),
    path('units/it/', views.unit_it, name='unit_it'),
    path('units/software-dev/', views.unit_software_dev, name='unit_software_dev'),

    # Sosyal Tesisler
    path('facilities/accommodation/', views.facility_accommodation, name='facility_accommodation'),
    path('facilities/restaurants/', views.facility_restaurants, name='facility_restaurants'),
    path('facilities/ticket-sales/', views.facility_ticket_sales, name='facility_ticket_sales'),

    # Teknik Birim
    path('technical/construction/', views.technical_construction, name='technical_construction'),
    path('technical/energy/', views.technical_energy, name='technical_energy'),
    path('technical/machine/', views.technical_machine, name='technical_machine'),
    path('technical/hvac/', views.technical_hvac, name='technical_hvac'),

    # Uygulamalar
    path('app/calendar/', views.app_calendar, name='app_calendar'),    
    path('app/chat/', views.app_chat, name='app_chat'),
    path('app/taskboard/', views.app_taskboard, name='app_taskboard'),
    path('app/contact/', views.app_contact, name='app_contact'),
    path('file-manager/dashboard/', views.file_dashboard, name='file_dashboard'),
    path('file-manager/documents/', views.file_documents, name='file_documents'),
    path('file-manager/media/', views.file_media, name='file_media'),
    path('file-manager/images/', views.file_images, name='file_images'),

    # Araçlar
    path('widgets/weather/', views.widgets_weather, name='widgets_weather'),
    path('widgets/blog/', views.widgets_blog, name='widgets_blog'),

    # Şifre Sıfırlama URL'leri
    path('reset-password/', auth_views.PasswordResetView.as_view(
        template_name='forgot.html',
        email_template_name='registration/password_reset_email.html',
        subject_template_name='registration/password_reset_subject.txt',
        success_url=reverse_lazy('password_reset_done')
    ), name='password_reset'),
    path('reset-password/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='registration/password_reset_done.html'
    ), name='password_reset_done'),
    path('reset-password/confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='registration/password_reset_confirm.html',
        success_url=reverse_lazy('password_reset_complete') # Burayı da düzeltelim
    ), name='password_reset_confirm'),
    path('reset-password/complete/', auth_views.PasswordResetCompleteView.as_view(
        template_name='registration/password_reset_complete.html'
    ), name='password_reset_complete'),  
]