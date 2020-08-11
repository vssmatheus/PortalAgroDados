from django.conf import settings
from django.shortcuts import render
from wtforms import Form, StringField, PasswordField
from wtforms import validators
from django.contrib.auth import login, logout
from django.http import HttpResponseRedirect

from .Repositories import LoginDao
from ....seguranca import SegurancaController
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from django.views.decorators.csrf import csrf_exempt

class FormLoginUsuario(Form):
    login = StringField('Login', [validators.DataRequired(message="Digite um login válido!")])
    senha = PasswordField('Senha', [validators.DataRequired(message="Digite uma senha válida!")])

class FormEsqueciSenha(Form):
    login = StringField('Login', [validators.DataRequired(message="Digite uma login válido!")])
    email = StringField('E-mail', [validators.Email(message="Digite um e-mail válido!")])

class FormAlteraSenha(Form):
    senha = PasswordField('Nova Senha', [validators.DataRequired(), validators.EqualTo('confirm', message=" não são iguais")])
    confirm = PasswordField('Confirme a Nova Senha')
    token = StringField()


class Login:
    @csrf_exempt
    def login(request):
        form = FormLoginUsuario(request.POST or None)
        au = LoginDao()

        resul = []
        if request.POST:
            param = {'Login': request.POST.get('login'), 'Senha': request.POST.get('senha')}
            param.update(request.POST.dict())

            resul = au.realiza_login(param)
            if resul == []:
                return render(request, 'Autenticacao/Login.html', {'form': form})
            return render(request, 'Autenticacao/Home.html')
        return render(request, 'Autenticacao/Login.html', {'form': form})

    def esqueci_minha_senha(request):
        form = FormEsqueciSenha(request.POST or None)
        retorno = {'form': form}
        return render(request, 'Autenticacao/EsqueciMinhaSenha.html', retorno)

    def altera_senha(request, token):
        form = FormAlteraSenha(None)
        retorno = {'form': form}
        return render(request, 'Autenticacao/AlteraSenha.html', retorno)

        # usado para deslogar atraves do menu no proprio portal pela rota frotas.brasilcard.com/Deslogar

    def deslogar(request):
        logout(request)
        return HttpResponseRedirect(settings.LOGIN_URL)

        # usado para deslogar o usuario quando ocorre algum tipo de erro, por exemplo "expirou senha, nao tem acesso a empresa"

    def deslogar_acesso(self, request):
        logout(request)
        return HttpResponseRedirect(settings.LOGIN_URL)