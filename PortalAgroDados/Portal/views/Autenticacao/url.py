from django.urls import path

from .Login.Controller import *

urlpatterns = [
    #AUTENTICA USUARIO
    path('Login', Login.login),
    path('', Login.login),
    path('Home', Login.login),
    path('EsqueciMinhaSenha', Login.esqueci_minha_senha),
    path('AlteraSenha/<slug:token>', Login.altera_senha),
    path('Deslogar', Login.deslogar),
]