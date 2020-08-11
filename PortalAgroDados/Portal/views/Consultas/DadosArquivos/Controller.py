from django.shortcuts import render

class ConsultarDadosArquivos:
    def render_consultar_dados_portal(request):
        return render(request, 'Consultas/ConsultarArquivos.html')

    def consultar_dados_portal(request):
        pass
