import json

from wtforms import Form, StringField, SelectField, BooleanField
from django.shortcuts import render
from django.http import JsonResponse

class FormCadastrarUsuarioPortal(Form):
    nome_completo = StringField("Nome Usuário: ")
    email = StringField("E-mail: ")
    login = StringField("Login Usuário: ")
    senha = StringField("Senha: ")
    status = SelectField("Status: ")
    codigo_usuario = StringField()

    direito_alterar = BooleanField()
    direito_excluir = BooleanField()
    direito_impressao = BooleanField()
    direito_incluir = BooleanField()
    PermVisuLogin = BooleanField()



class CadastrosAcessoPortal:
    def render_tela_usuario_portal(request):
        form = FormCadastrarUsuarioPortal()
        form.status.choices = [('TD', 'TODOS'),
                               ('A', 'ATIVO'),
                               ('B', 'BLOQUEADO'),
                               ('C', 'CANCELADO')]
        return render(request, 'Cadastros/CadastroUsuarioPortal.html', {'form': form})


    def cadastar_usuario_portal(request):
        pass