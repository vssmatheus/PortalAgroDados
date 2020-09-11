from django.http import JsonResponse
from django.shortcuts import render
from wtforms import Form, StringField, SelectField, BooleanField, validators
from wtforms.validators import DataRequired, Email

from .Repositories import CadastrarUsuarioPortalDAO
from ...Consultas.UsuarioPortal.Repositories import ConsultarUsuarioPortalDao
from ...Funcoes.Controller import Funcoes



class FormCadastrarUsuarioPortal(Form):
    codigo_usuario = StringField()

    nome_completo = StringField("Nome Usuário: ",  validators=[DataRequired()])
    email = StringField("E-mail: ", validators=[DataRequired(), Email()])
    login = StringField("Login Usuário: ", validators=[DataRequired()])
    senha = StringField("Senha: " ,validators=[DataRequired()])
    status = SelectField("Status: ", choices=[('A', 'ATIVO'), ('C', 'CANCELADO'), ('B', 'BLOQUEADO')])
    matricula = StringField("Matrícula:")
    cpf = StringField("CPF: ", validators=[DataRequired()])

    direito_alterar = BooleanField('Alterar')
    direito_excluir = BooleanField('Excluir')
    direito_grafico = BooleanField('Impressão')
    direito_incluir = BooleanField('Incluir')
    direito_visu_login = BooleanField('Visualizar Logins')



class CadastrosAcessoPortal:

    def render_tela_usuario_portal(request, codigo_usuario):
        form = FormCadastrarUsuarioPortal()

        if codigo_usuario > 0:
            cu = ConsultarUsuarioPortalDao()

            param = {}
            param = {
                'CodigoUsuario': request.POST.get(codigo_usuario),
                'NomeUsuario': request.POST.get('NomeUsuario'),
                'EmailUsuario': request.POST.get('EmailUsuario'),
                'LoginUsuario': request.POST.get('LoginUsuario'),
                'SenhaUsuario': request.POST.get('SenhaUsuario'),
                'StatusUsuario': request.POST.get('StatusUsuario'),
                'Matricula': request.POST.get('Matricula'),
                'Cpf': request.POST.get('Cpf'),
                'Alterar': request.POST.get('Alterar'),
                'Excluir': request.POST.get('Excluir'),
                'Grafico': request.POST.get('Grafico'),
                'Incluir': request.POST.get('Incluir'),
                'Visualizar': request.POST.get('Visualizar')
            }

            dados_usuario = cu.consultar_usuario_portal(param)

            if dados_usuario == []:
                return render(request, 'AccessDenied.html')

            dados_usuario = dados_usuario[0]

            form.nome_completo.data = dados_usuario['NOME']
            form.email.data = dados_usuario['EMAIL']
            form.cpf.data = dados_usuario['CPF']
            form.matricula.data = dados_usuario['MATRICULA']
            form.login.data = dados_usuario['LOGIN']
            form.status.data = dados_usuario['DESCRICAO_STATUS']

            form.direito_excluir.data = (dados_usuario['EXCLUIR'] == 'S' and True or False)
            form.direito_incluir.data = (dados_usuario['INCLUIR'] == 'S' and True or False)
            form.direito_alterar.data = (dados_usuario['ALTERAR'] == 'S' and True or False)
            form.direito_grafico.data = (dados_usuario['GRAFICO'] == 'S' and True or False)
            form.direito_visu_login.data = (dados_usuario['VISUALIZAR_LOGINS'] == 'S' and True or False)

        form.senha.label.text = 'Nova Senha'

        form.codigo_usuario.data = codigo_usuario

        return render(request, 'Cadastros/CadastroUsuarioPortal.html', {'form': form})

    def cadastar_usuario_portal(request):
        cup = CadastrarUsuarioPortalDAO()
        param = request.POST.dict()

        resul = cup.cadastrar_usuario_portal(param)
        return JsonResponse(resul)

    def alterar_usuario_portal(request):
        cup = CadastrarUsuarioPortalDAO()

        param = {}
        param.update(request.POST.dict())

        resul = cup.alterar_usuario_portal(param)
        return JsonResponse(resul)