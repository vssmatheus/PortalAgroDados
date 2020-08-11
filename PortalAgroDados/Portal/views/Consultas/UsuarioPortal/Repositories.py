from ....conexao import Conexao

class ConsultarUsuarioPortalDao:
    def consultar_usuario_portal(self, param):
        cx = Conexao()
        cx.conectar()

        sql = """ SELECT USU.CODIGO,
                         USU.NOME,
                         USU.EMAIL,
                         USU.SENHA,
                         USU.CPF,
                         USU.MATRICULA,
                         USU.LOGIN,
                         USU.DATA_CADASTRO,
                         CASE USU.STATUS
                              WHEN  'A'  THEN 'ATIVO'
                              WHEN  'B' THEN 'BLOQUEADO'
                              WHEN  'C' THEN 'CANCELADO'
                         END AS DESCRICAO_STATUS,
                         CASE PER.PERM_INCLUIR  
                              WHEN  'S' THEN 'SIM'
                              WHEN  'N' THEN 'NÃO' END AS  INCLUIR,
                         CASE PER.PERM_ALTERACAO  
                              WHEN  'S' THEN 'SIM'
                              WHEN  'N' THEN 'NÃO' END AS  ALTERAR,     
                         CASE PER.PERM_EXCLUSAO  
                              WHEN  'S' THEN 'SIM'
                              WHEN  'N' THEN 'NÃO' END AS  EXCLUIR,
                         CASE PER.PERM_GRAFICO  
                              WHEN  'S' THEN 'SIM'
                              WHEN  'N' THEN 'NÃO' END AS  GRAFICO,
                         CASE PER.PERM_VISUALIZAR_LOGIN  
                              WHEN  'S' THEN 'SIM'
                              WHEN  'N' THEN 'NÃO' END AS  VISUALIZAR_LOGINS
                FROM AG_USUARIO_PORTAL USU,
                         AG_PERMISSOES PER
                WHERE USU.CODIGO = PER.CODIGO
        """

        if 'LoginUsuario' in param:
            if param['LoginUsuario'] != '':
                param['LoginUsuario'] = '%{}%'.format(param['LoginUsuario'])
                sql += """ AND UPPER(TRIM(USU.LOGIN)) LIKE UPPER(TRIM(%(LoginUsuario)s ))"""

        if 'NomeUsuario' in param:
            if param['NomeUsuario'] != '':
                param['NomeUsuario'] = '%{}%'.format(param['NomeUsuario'])
                sql += """ AND UPPER(TRIM(USU.NOME)) LIKE UPPER(TRIM(%(NomeUsuario)s ))"""

        if 'StatusUsuario' in param:
            if param['StatusUsuario'] != '' and param['StatusUsuario'] != 'TD':
                sql += """ AND USU.STATUS = %(StatusUsuario)s"""

        sql += """ ORDER BY 2 ASC """

        print(sql, param)

        resul = cx.select(sql, param)

        return resul