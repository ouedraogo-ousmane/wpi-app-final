from .settings import *
import dj_database_url
DEBUG = False
TEMPLATE_DEBUG = False
ALLOWED_HOSTS = ['wlsb-backend.herokuapp.com']
DATABASES['default'] = dj_database_url.config()

SECRET_KEY = "x+6q&^7#2hvu8wan1d&ox^kh1)d1vj7rqk3&7iph!_@$wxro$e"

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"