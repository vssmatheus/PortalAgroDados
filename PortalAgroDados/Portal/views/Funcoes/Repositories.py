from xml.etree import ElementTree


from ...conexao import *
import requests
import json

class FuncoesDao:


    def consulta_cidade_por_cep(self, cep):
        headers = {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'User-Agent': 'BRASILCARD',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Connection': 'keep-alive',
                }
        response = requests.get('http://viacep.com.br/ws/'+cep+"/json/", headers=headers)

        cidade = response.json()

        return cidade

    def consulta_estados_ibge(self):
        """busca estados pelo api do IBGESe queiser trazer todos os estados do brasil, é só consumir ele.
        Se quiser estados especificos, consumir nos repositories das respectivas telas"""
        chave = 'estados'
        cx = Conexao()
        valida_redis = cx.testeConexaoRedis(chave)
        if 'chave_expirada' in valida_redis or 'servidor_fora' in valida_redis:
            header = {"Content-type": "application/json"}
            response = requests.request('GET', 'https://servicodados.ibge.gov.br/api/v1/localidades/estados',headers=header)
            if 'chave_expirada' in valida_redis:
                cx.cache.set('estados', json.dumps(response.json()), 604800)  # expira em uma semana
            estados = response.json()
        else:
            estados = json.loads(cx.cache.get('estados'))

        return estados

    def consulta_cidades_ibge(self, estado):
        """busca todas as cidades de acordo com o codigo do estado, da o mesmo bug do estado,
        ainda nao consegui resolver. Pode consumir se quiser trazer todas as cidades de um estado.
        Metodos onde traz cidades especificas estao no repositories das suas respectivas telas"""
        # valida_redis = self.testeConexaoRedis(str(estado))
        cx = Conexao()
        valida_redis = cx.testeConexaoRedis(str(estado))
        if 'chave_expirada' in valida_redis or 'servidor_fora' in valida_redis:
            headers = {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'User-Agent': 'BRASILCARD',
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Connection': 'keep-alive',
                    }
            response = requests.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/'+estado+'/municipios', headers=headers)
            # if 'chave_expirada' in valida_redis:
            #     cx.cache.set(str(estado), json.dumps(response.json()), 604800)  # expira em uma semana
            cidades = response.json()
        else:
            cidades = json.loads(cx.cache.get(str(estado)))

        return cidades

    # Informa as datas de inicio e final do periodo de crédito plano recebendo o parametro como '0' para periodo atual, '-1' para periodo anterior
    #REVER ESTA FUNCAO
    def buscar_dados_periodo(self, param):
        cx = Conexao()
        cx.conectar()

        sql = """SELECT
                    to_char(add_months(fun_data_inicial_plano(fun_plano(filial, codigo)), :QtdPeriodosPlano), 'DD/MM/RRRR') inicio
                    ,
                    to_char(add_months(fun_data_inicial_plano(fun_plano(filial, codigo)), - 1), 'DD/MM/RRRR') inicio_credito,
                    to_char(add_months(fun_data_final_plano(fun_plano(filial, codigo)), :QtdPeriodosPlano), 'DD/MM/RRRR') fim
                 FROM
                    adc_clientes
                 WHERE
                    filial = :Filial
                    AND codigo = :Cliente"""

        resul = cx.select(sql,param)

        return resul

    # Recebe o PlanoFechamento da requisição e retorna a datas do periodo atual do plano
    def data_inicial_final_plano(self, plano, periodo):
        cx = Conexao()
        cx.conectar()
        param = {'Plano': plano, 'Periodo':periodo}
        sql = """ select TO_CHAR (FUN_PEGA_DATA_INICIAL(:Plano, :Periodo), 'DD/MM/YYYY') data_inicio_plano,
            TO_CHAR (FUN_PEGA_DATA_FINAL(:Plano , :Periodo), 'DD/MM/YYYY') data_fim_plano from dual """

        resul = cx.select(sql, param)

        return resul

    def consulta_planos(request, param):
        cx = Conexao()
        cx.conectar()

        sql = """ SELECT
                      codigo,
                      descricao,
                      to_char(to_date(to_char(dia_fechamento, '00')
                                      || to_char(sysdate, '/MM/YYYY'), 'DD/MM/YYYY'), 'DD/MM/YYYY') data_inicio_plano,
                      to_char(add_months(to_date(to_char(dia_fechamento, '00')
                                                 || to_char(sysdate, '/MM/YYYY'), 'DD/MM/YYYY') - 1, 1), 'DD/MM/YYYY') data_fim_plano
                  FROM
                      adc_planos_fechamentos
                  WHERE 
                     codigo <> 'Z' """


        if param['Plano'] != '':
            sql += """ and codigo <> :Plano """
        else:
            del param['Plano']

        sql += """ order by codigo asc """

        resul = cx.select(sql, param)

        return resul

    def consulta_estado(request, param):
        cx = Conexao()
        cx.conectar()

        sql = """SELECT UPPER (FUN_REMOVE_ACENTOS (TRIM (CNV.UF_EMPRESA))) DESCRICAO
                 FROM OME_ORCAMENTOS O, ADC_CONVENIADAS CNV, OME_USUARIOS V
                 WHERE  O.CODIGO_TERMINAL = CNV.CODIGO_TERMINAL
                        AND V.FILIAL_USUARIO = O.FILIAL_USUARIO
                        AND V.CLIENTE = O.CLIENTE
                        AND V.CODIGO = O.CODIGO_USUARIO
                        AND O.FILIAL_USUARIO = :Filial
                        AND O.CLIENTE = :Cliente
                        AND CNV.UF_EMPRESA IS NOT NULL
              """

        sql += """ GROUP BY UPPER(FUN_REMOVE_ACENTOS(TRIM(CNV.UF_EMPRESA))) ORDER BY 1"""
        resul = cx.select(sql, param)

        return resul

    def consutar_cidades(request, param):
        cx = Conexao()
        cx.conectar()

        sql = """ SELECT UPPER(FUN_REMOVE_ACENTOS(TRIM(CNV.LOCALIDADE_EMPRESA))) DESCRICAO 
                  FROM OME_USUARIOS VEI, OME_ORCAMENTOS O, ADC_CONVENIADAS CNV 
                  WHERE   CNV.UF_EMPRESA = :Estado
                          AND O.CODIGO_TERMINAL = CNV.CODIGO_TERMINAL 
                          AND O.FILIAL_USUARIO = :Filial
                          AND O.CLIENTE = :Cliente 
                          AND O.FILIAL_USUARIO = VEI.FILIAL_USUARIO 
                          AND O.CLIENTE = VEI.CLIENTE 
                          AND O.CODIGO_USUARIO = VEI.CODIGO 
                          AND CNV.LOCALIDADE_EMPRESA IS NOT NULL
             """

        sql += """ GROUP BY UPPER(FUN_REMOVE_ACENTOS(TRIM(CNV.LOCALIDADE_EMPRESA))) ORDER BY 1"""

        resul = cx.select(sql, param)
        return resul

    def busca_status_orcamento_cv(request, param):
        cx = Conexao()
        cx.conectar()

        sql = """ SELECT DISTINCT ST.STATUS, ST.DESCRICAO
                  FROM ORC_STATUS ST, OME_ORCAMENTOS O
                  WHERE ST.STATUS NOT IN ('RA')
                  AND ST.STATUS = O.STATUS
                  AND O.FILIAL_CONVENIADA = :FilialConveniada
                  AND O.CONVENIADA = :Conveniada
                  AND O.SEQUENCIA_CONVENIADA = :SequenciaConveniada   """

        resul = cx.select(sql, param)

        return resul

    def busca_status_orcamento(request, param):
        cx = Conexao()
        cx.conectar()

        sql = """ SELECT DISTINCT ST.STATUS, ST.DESCRICAO
                  FROM ORC_STATUS ST, OME_ORCAMENTOS O
                  WHERE ST.STATUS NOT IN ('RA')
                  AND ST.STATUS = O.STATUS
                  AND O.FILIAL_USUARIO = :Filial
                  AND O.CLIENTE = :Cliente  """


        resul = cx.select(sql, param)

        return resul

    def busca_tipo_orcamento_cliente(request, param):
        cx = Conexao()
        cx.conectar()

        sql = """  SELECT DISTINCT   ORC.CODIGO_TIPO_ORCAMENTO   CODIGO,
                   FUN_MOSTRA_TIPO_ORC_OME (ORC.CODIGO_TIPO_ORCAMENTO) DESCRICAO
                   FROM OME_ORCAMENTOS ORC, OME_USUARIOS V
                   WHERE   ORC.FILIAL_USUARIO = V.FILIAL_USUARIO
                           AND ORC.CLIENTE = V.CLIENTE
                           AND ORC.CODIGO_USUARIO = V.CODIGO
                           AND ORC.FILIAL_USUARIO = :Filial
                           AND ORC.CLIENTE = :Cliente  """

        if param['Departamentos'] != '':
            sql += """ AND V.CODIGO_DEPARTAMENTO IN ({})""".format(param['Departamentos']).replace('[','').replace(']','')
        else:
            sql += """ AND V.CODIGO_DEPARTAMENTO = 0 """

        del param['Departamentos']

        sql += """ ORDER BY 2 ASC"""

        resul = cx.select(sql, param)

        return resul

    def busca_estabelecimentos(request, param):
        cx = Conexao()
        cx.conectar()

        sql = """  SELECT   C.ABREVIATURA || ' - ' || FUN_CIDADE_CNV 
                   (C.FILIAL, C.CODIGO, C.SEQUENCIA) NOME,
                   C.FILIAL||'-'||C.CODIGO||'-'||C.SEQUENCIA as CODIGO_TERMINAL
                   FROM ADC_CONVENIADAS C, OME_ORCAMENTOS ORC, OME_USUARIOS V
                   WHERE   C.STATUS = 'A'
                   AND C.CODIGO_TERMINAL = ORC.CODIGO_TERMINAL
                   AND ORC.FILIAL_USUARIO = V.FILIAL_USUARIO
                   AND ORC.CLIENTE = V.CLIENTE
                   AND ORC.CODIGO_USUARIO = V.CODIGO
                   AND ORC.FILIAL_USUARIO = :Filial
                   AND ORC.CLIENTE = :Cliente  """

        if 'Departamentos' in param:
            if param['Departamentos'] != '':
                sql += """ AND V.CODIGO_DEPARTAMENTO IN ({})""".format(param['Departamentos']).replace('[', '').replace(
                    ']', '')
            else:
                sql += """ AND V.CODIGO_DEPARTAMENTO = 0 """
            del param['Departamentos']

        if 'Uf' in param:
            if param['Uf'] != '' and param['Uf'] != 'T':
                sql += """ AND C.UF_EMPRESA = :Uf """
            else:
                del param['Uf']

        if 'Cidade' in param:
            if param['Cidade'] != '' and param['Cidade'] != 'TD' and param['Cidade'] != 'T':
                sql += """ AND C.LOCALIDADE_EMPRESA = :Cidade """
            else:
                del param['Cidade']

        sql += """ GROUP BY C.ABREVIATURA, C.CODIGO_TERMINAL, C.FILIAL, C.CODIGO, C.SEQUENCIA ORDER BY 1 """

        resul = cx.select(sql, param)

        return resul
