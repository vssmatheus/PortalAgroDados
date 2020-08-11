from django.urls import path

from .DadosArquivos.Controller import CadastrarDadosArquivos
from .UsuarioPortal.Controller import CadastrosAcessoPortal

urlpatterns = [
    #AUTENTICA USUARIO
    path('CadastroUsuarioPortal/<int:codigo_usuario>', CadastrosAcessoPortal.render_tela_usuario_portal),
    path('InsereUsuario', CadastrosAcessoPortal.cadastar_usuario_portal),
    path('AlterarUsuario', CadastrosAcessoPortal.alterar_usuario_portal),

    #Orcamento
    path('CadastrarDadosArquivos/<slug:codigo_arquivo>', CadastrarDadosArquivos.render_tela_cadastro_dados_arquivos),
    path('RegistrarDadosArquivos', CadastrarDadosArquivos.cadastro_dados_arquivos),

]