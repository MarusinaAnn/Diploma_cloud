from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from storage.views import FileViewSet
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.views import LoginView, LogoutView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include('storage.urls')),
    path("api/auth/", include('accounts.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)





# urlpatterns += [
#     path('', TemplateView.as_view(template_name='index.html')),
# ]

# urlpatterns += [
#     re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
# ]
