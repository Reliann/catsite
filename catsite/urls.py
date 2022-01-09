from django.contrib import admin
from django.urls import path , include, re_path
from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache


urlpatterns = [
    path('admin/', admin.site.urls),    
    path('api/', include('catlogs.urls')),
    #never_cache(re_path(r'', TemplateView.as_view(template_name='index.html')))
    re_path(r'', TemplateView.as_view(template_name='index.html'))  # i assume there is a better way..
]
