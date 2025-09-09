from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-q(*ty$$q5kehardprzj0kqggsslki$3axxvs$3ap&46*!uub=h'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []

# Flutter Web'in localhost'tan erişimine izin vermek için
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8000", # Django'nun kendisi
    "http://localhost:3000", # React'in varsayılanı (gelecek için)
    # Flutter Web'in çalışacağı portu buraya ekleyeceğiz (örn: http://localhost:5000)
]
# Geliştirme ortamında daha rahat olmak için şimdilik:
CORS_ORIGIN_ALLOW_ALL = True # DİKKAT: Prodüksiyonda False olmalı!


# Application definition
INSTALLED_APPS = [
    'daphne',    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Üçüncü Parti Uygulamalar
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'channels',
    
    # Bizim Uygulamalarımız
    'users',
    'operations',
    'communications',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'nexus_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'nexus_backend.wsgi.application'

# Django'nun varsayılan User modelini bizimkiyle değiştireceğiz
AUTH_USER_MODEL = 'users.User' # users uygulamasındaki User modelimiz

# Django REST Framework Ayarları
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

#DATABASES = {
#    'default': {
#        'ENGINE': 'django.db.backends.sqlite3',
#        'NAME': BASE_DIR / 'db.sqlite3',
#    }
#}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql', # Motoru postgresql olarak değiştiriyoruz
        'NAME': 'nexus_db',                         # Oluşturduğumuz veritabanının adı
        'USER': 'ejderadmin',                       # Oluşturduğumuz kullanıcının adı
        'PASSWORD': 'Ejder.25',                     # Kullanıcının şifresi
        'HOST': '10.65.2.168',                      # Veritabanı sunucusunun adresi (genellikle localhost)
        'PORT': '5432',                             # PostgreSQL'in varsayılan portu
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

ASGI_APPLICATION = 'nexus_backend.asgi.application'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            "hosts": [('127.0.0.1', 6379)], # Redis sunucu adresimiz
        },
    },
}