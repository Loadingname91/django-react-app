from .views import LoginApi, RegisterApi, ActivateUser , LogOutApi
from django.urls import path

urlpatterns = [
    path("login/", LoginApi.as_view()),
    path("logout/", LogOutApi.as_view()),
    path("register/", RegisterApi.as_view()),
    path("user/", ActivateUser.as_view())
]
