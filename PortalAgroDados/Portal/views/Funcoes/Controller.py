from django.http import JsonResponse
from .Repositories import FuncoesDao
from ...conexao import Conexao
import uuid
import json
import re


class Funcoes:


    def retira_duplicados(self, dados, chave):
        lista_chave = []
        for i in dados:
            lista_chave.append(i[chave])
        return list(set(lista_chave))

    def realiza_filtro(self, dados, chave_dados, valor_procurado):
        lista = []
        for i in dados:
            if i[chave_dados] == valor_procurado:
                lista.append(i)
        return lista

    def soma_valores(self, dados,chave, chave_valor_somado, formatacao=True):
        valor_somado = 0
        for i in dados:
            valor_somado += float(str(i[chave]).replace(' ', '').replace(',', '.'))
        for i in dados:
            if formatacao:
                i[chave_valor_somado] = self.number_to_real(valor_somado)
            else:
                i[chave_valor_somado] = (int(valor_somado))
        return dados

    def organiza_lista(self, dados, novos_dados, chave):
        if chave[0] == None:
            for j in dados:
                novos_dados.append(j)
        else:
            for c in chave:
                for i in dados:
                    if c not in i:
                        i[c] = ''
                        novos_dados.append(i)

        pass

    def number_to_real(self, id):
        return 'R$ {:,.2f}'.format(float(id)).replace(',', 'v').replace('.', ',').replace('v', '.')

    def real_to_number(self, valor):
        if not str(valor).__contains__(','):
            return valor+".00"
        x = valor.split(',')
        return float(x[0].replace('R$', '').replace('.', '') + "." + x[1])

    def formata_valores(self, id):
        return '{:,.2f}'.format(float(id)).replace(',', 'v').replace('.', ',').replace('v', '.')

    def retira_caracteres(self, texto):
       if texto != None:
            return re.sub("[\s+!-.:@-\\\-``]", ' ', texto)
       else:
           return ''

    def gera_token(self, dados):
        redis = Conexao()
        chave = str(uuid.uuid4())
        try:
            redis.cache.set(chave, json.dumps(dados), 86400)  # expira em um dia
        except:
            return None
        return chave

    def consulta_cidades_ibge(request, uf=None):
        fd = FuncoesDao()
        cidades = []
        resul = []
        if uf == None:
            if request.POST.get('Estado') != "0":
                resul = fd.consulta_cidades_ibge(request.POST.get('Estado'))
        else:
            resul = fd.consulta_cidades_ibge(uf)

        for i in resul:
            cidades.append({'DESCRICAO' : (i['nome'].upper())})

        return JsonResponse({'Cidades': cidades})

    def inclui_accordion_sql(request, sql, indices, somar):
        nivel = 0
        temp = ''
        cabecalho_select = ''
        for i in indices:
            nivel += 1
            if nivel == 1:
                temp = i
            else:
                temp = temp + ', ' +i

            for s in somar:
                cabecalho_select = cabecalho_select + ' SUM(' + s + ') OVER(PARTITION BY ' + temp + ' ) AS TOTAL_' + s + '_NIVEL_' + str(nivel) + ','

        return 'SELECT ' + cabecalho_select + ' QUERY.* FROM (' + sql + ') QUERY'

    def monta_accordion(request, sql, param, niveis, somar, campos_soma, formatar_campos):
        """
        :param sql: Consulta SQL a ser rodada no Oracle
        :param param: Binds da consulta
        :param niveis: Niveis do accordion (Usar mesmo nome dos campos da SQL). Ex.: ['TERMINAL', 'DATA_VENDA', 'CLIENTE'] .....
        :param somar: Campo(s) com o VALOR a ser somado por nivel. Ex.: ['VALOR', 'QUANTIDADE'] ...
        :param campos_soma: Nome que estará visível no Accordion referente ao parametro 'somar'. Ex.: ['Total', 'Quantidade']
        :param formatar_campos: O valor do parametro 'somar' irá passar pelo number_to_real.: Ex.: [True, False]
        :rtype: resul.: Resultado da consulta formatada.
        :rtype: total.: Totais que irá ser usado no rodape das paginas. Nome padrão : soma_rodape_+(parametro 'somar'). Ex. soma_rodape_valor / soma_rodape_quantidade
         """

        cx = Conexao()
        cx.conectar()
        resul = []
        sql_accordion = request.inclui_accordion_sql(sql, niveis, somar)
        try:
            resul = cx.select(sql_accordion, param)
        except Exception as e:
            print("ERRO NA CONSULTA: ", e)

        print(resul)

        total = {}
        for s in somar:
            total.update({'soma_rodape_' + str(s).lower(): 0})

        for i in resul:
            nivel = 0
            for n in niveis:
                nivel += 1
                concatenar = ''
                for s in range(len(somar)):
                    campo = 'TOTAL_' + somar[s] + '_NIVEL_' + str(nivel)
                    valor = i[campo]
                    if formatar_campos[s]:
                        valor = request.number_to_real(i[campo])

                    # Alguns indices de accordions já vem com valores do banco. Se no parametro for None não irá concatenar
                    if campos_soma[s] != None:
                        concatenar = concatenar + ' | ' + campos_soma[s] + ' : {}'.format(valor)
                i[n] = str(i[n]) + concatenar
            cont_somar = 0
            for t in somar:
                total['soma_rodape_' + str(t).lower()] += float(i[t])
                if formatar_campos[cont_somar]:
                    i[t] = request.number_to_real(i[t])
                cont_somar += 1

        nivel = 0
        for t in somar:
            valor = total['soma_rodape_' + str(t).lower()]
            if formatar_campos[nivel]:
                valor = request.number_to_real(valor)
            total['soma_rodape_' + str(t).lower()] = valor
            nivel += 1

        return resul, total
