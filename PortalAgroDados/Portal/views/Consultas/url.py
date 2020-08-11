from django.urls import path

from .DadosArquivos.Controller import ConsultarDadosArquivos
from .UsuarioPortal.Controller import ConsultarUsuarioPortal

urlpatterns = [
    # USUARIO PORTAL
    path('ConsultaListaUsuariosPortal', ConsultarUsuarioPortal.render_consultar_usuarios_portal),
    path('ListarUsuarioPortal', ConsultarUsuarioPortal.consultar_usuario_portal),

    #Consultar arquivos importados
    path('ConsultaListaDadosArquivos', ConsultarDadosArquivos.render_consultar_dados_portal),
    path('ListarDadosArquivos', ConsultarDadosArquivos.consultar_dados_portal),
]