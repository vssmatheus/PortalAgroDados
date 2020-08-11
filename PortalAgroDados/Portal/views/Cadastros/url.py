from django.urls import path

from .DadosArquivos.Controller import CadastrarDadosArquivos
from .UsuarioPortal.Controller import CadastrosAcessoPortal

urlpatterns = [
    #AUTENTICA USUARIO
    path('CadastroUsuarioPortal', CadastrosAcessoPortal.render_tela_usuario_portal),
    # path('CadastroUsuarioPortal/<slug:codigo_usuario>', CadastrosAcessoPortal.render_tela_usuario_portal),
    path('RegistrarUsuarioPortal/<slug:codigo_usuario>', CadastrosAcessoPortal.cadastar_usuario_portal),

    #Orcamento
    path('CadastrarDadosArquivos/<slug:codigo_arquivo>', CadastrarDadosArquivos.render_tela_cadastro_dados_arquivos),
    path('RegistrarDadosArquivos', CadastrarDadosArquivos.cadastro_dados_arquivos),

]