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
    form = FormCadastrarUsuarioPortal()
    mensagemTela = None
    aproveitaForm = False

    def populaFormUsuario(request, dados_usuario):
        cad = CadastrosAcessoPortal

        cad.form.nome_completo.data = dados_usuario['NOME']
        cad.form.email.data = dados_usuario['EMAIL']
        cad.form.cpf.data = dados_usuario['CPF']
        cad.form.matricula.data = dados_usuario['MATRICULA']
        cad.form.login.data = dados_usuario['LOGIN']
        cad.form.status.data = dados_usuario['DESCRICAO_STATUS']

        cad.form.direito_excluir.data = (dados_usuario['EXCLUIR'] == 'S' and True or False)
        cad.form.direito_incluir.data = (dados_usuario['INCLUIR'] == 'S' and True or False)
        cad.form.direito_alterar.data = (dados_usuario['ALTERAR'] == 'S' and True or False)
        cad.form.direito_grafico.data = (dados_usuario['GRAFICO'] == 'S' and True or False)
        cad.form.direito_visu_login.data = (dados_usuario['VISUALIZAR_LOGINS'] == 'S' and True or False)

    def render_tela_usuario_portal(request, codigo_usuario):
        cad = CadastrosAcessoPortal
        cg = ConsultarUsuarioPortalDao()

        if not cad.aproveitaForm:
            cad.form = None
            cad.form = FormCadastrarUsuarioPortal()

        cad.form.codigo_usuario.data = int(codigo_usuario)

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
        retornoTela = {'form': cad.form}

        if int(codigo_usuario) > 0 and not cad.aproveitaForm:
            dados_usuario = cg.consultar_usuario_portal(param)

            if dados_usuario == []:
                return render(request, 'AccessDenied.html')

            cad.populaFormUsuario(request, dados_usuario[0])
            cad.form.senha.label = 'Nova Senha:'
            cad.form.senha.render_kw = {'required': False}

        if cad.mensagemTela != None:
            retornoTela.update({'Mensagem': cad.mensagemTela})

        cad.aproveitaForm = False
        cad.mensagemTela = None

        return render(request, 'Cadastros/CadastroUsuarioPortal.html', retornoTela)


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