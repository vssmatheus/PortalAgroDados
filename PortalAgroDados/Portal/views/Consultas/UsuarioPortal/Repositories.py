from ...Funcoes.Controller import Funcoes
from ....conexao import Conexao
import requests
from django.conf import settings
import json

class ConsultarUsuarioPortalDao:
    def consultar_usuario_portal(self, param):
        cx = Conexao()
        cx.conectar()

        sql = """
                SELECT USU.CODIGO,
                       USU.NOME,
                       USU.EMAIL,
                       USU.SENHA,
                       USU.LOGIN,
                       USU.DATA_CADASTRO,
                       CASE USU.STATUS_USUARIO
                            WHEN  'A'  THEN 'ATIVO'
                            WHEN  'B' THEN 'BLOQUEADO'
                            WHEN  'C' THEN 'CANCELADO'
                       END AS DESCRICAO_STATUS,
                       PER.PERM_ALTERACAO ALTERAR,
                       PER.PERM_EXCLUSAO EXCLUIR,
                       PER.PERM_IMPRESSAO IMPRIMIR,
                       PER.PERM_INCLUIR INCLUIR,
                       PER.PERM_VISUALIZAR_LOGIN VISUALIZAR_LOGINS
                FROM AG_USUARIO_PORTAL USU,
                     AG_PERMISSOES PER
                WHERE USU.CODIGO = PER.CODIGO
        """
        if 'LoginUsuario' in param:
            if param['LoginUsuario'] != '' :
                sql += """ AND USU.LOGIN = %(LoginUsuario)s """
            else:
                del param['LoginUsuario']

        if 'NomeUsuario' in param:
            if param['NomeUsuario'] != '' :
                sql += """ AND USU.NOME = %(NomeUsuario)s """
            else:
                del param['NomeUsuario']

        if 'StatusUsuario' in param:
            if param['StatusUsuario'] != '' and param['StatusUsuario'] != 'TD':
                param['StatusUsuario'] = '%{}%'.format(param['StatusUsuario'])
                sql += """ AND UPPER(USU.STATUS_USUARIO) LIKE UPPER(%(StatusUsuario)s)"""
            else:
                del param['StatusUsuario']

        sql += """ ORDER BY 2 ASC """

        resul = cx.select(sql, param)

        return resul