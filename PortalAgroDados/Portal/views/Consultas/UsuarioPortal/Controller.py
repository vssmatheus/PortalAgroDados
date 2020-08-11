from wtforms import Form, StringField, SelectField
from django.shortcuts import render
from django.http import JsonResponse

from .Repositories import ConsultarUsuarioPortalDao


class FormConsultarUsuarioPortal(Form):
    login = StringField("Login: ")
    nome_usuario = StringField("Nome Usuário: ")
    status = SelectField("Status: ", choices=[('TD', 'TODOS'), ('A', 'ATIVO'), ('C', 'CANCELADO'), ('B', 'BLOQUEADO')])

class ConsultarUsuarioPortal:
    def render_consultar_usuarios_portal(request):
        form = FormConsultarUsuarioPortal()

        return render(request, 'Consultas/UsuarioPortal.html', {'form': form})

    def consultar_usuario_portal(request):
        cd = ConsultarUsuarioPortalDao()

        param = {}
        param.update(request.POST.dict())

        print(param)

        relacao = cd.consultar_usuario_portal(param)
        return JsonResponse({'Relacao': relacao})
