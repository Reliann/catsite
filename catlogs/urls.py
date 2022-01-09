from django.urls import path
from django.urls.resolvers import URLPattern
from rest_framework import routers
from .api import CatViewSet, UserViewSet
from rest_framework_simplejwt.views import  TokenRefreshView
from .views import ObtainCustomTokenView

# create a router
router = routers.DefaultRouter()

# connect a router to viewset
router.register('cats', CatViewSet, 'cats')
# route provide add user, add cat, put etc...
router.register('users', UserViewSet, 'user')

# routes for tokens
token_paths = [
    path('auth/obtain/',ObtainCustomTokenView.as_view(), name='get-token'),
    path('auth/refresh/',TokenRefreshView.as_view(), name='auth-refresh'),
]

urlpatterns = router.urls + token_paths


