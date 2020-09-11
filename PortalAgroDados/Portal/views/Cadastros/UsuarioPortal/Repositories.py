from ....conexao import *
from ...Funcoes.Controller import Funcoes

class CadastrarUsuarioPortalDAO:
    def cadastrar_usuario_portal(self, param):
        cx = Conexao()
        cx.conectar()

        param['Cpf'] = param['Cpf'].replace('.', '').replace('-', '')
        if self.verifica_usuario_existente(param) != []:
            return {'Mensagem': 'CPF Cadastro para outro Usuário.\nPor favor, verifique para prosseguir com o Cadastro!',
                    'Tipo': 'info'}

        f = Funcoes()
        param['LoginUsuario'] = f.retira_caracteres(param['LoginUsuario']).replace(' ', '')
        param['NomeUsuario'] = f.retira_caracteres(param['NomeUsuario'])
        param['Cpf'] = param['Cpf'].replace('.', '').replace('-', '')

        sql1 = """INSERT INTO AG_USUARIO_PORTAL (NOME, EMAIL, CPF, MATRICULA, SENHA, LOGIN, DATA_CADASTRO, STATUS )
                  VALUES (%(NomeUsuario)s, %(EmailUsuario)s, %(Cpf)s, %(Matricula)s, %(SenhaUsuario)s, %(LoginUsuario)s, CURRENT_TIMESTAMP, 'A' );
        """

        resul = cx.executa(sql1, param, True)


        if 'RowsEffect' in resul:
            if int(resul['RowsEffect']) > 0:
                cx.conectar()
                cod_usu = cx.select("""SELECT CODIGO FROM  AG_USUARIO_PORTAL  WHERE LOGIN =  %(LoginUsuario)s""", param)
                cod_usu = cod_usu[0]['CODIGO']
                param.update({'CodigoUsuario' : cod_usu})

                param['Alterar'] = f.muda_permissao(param['Alterar'])
                param['Excluir'] = f.muda_permissao(param['Excluir'])
                param['Grafico'] = f.muda_permissao(param['Grafico'])
                param['Incluir'] = f.muda_permissao(param['Incluir'])
                param['Visualizar'] = f.muda_permissao(param['Visualizar'])

                sql2 = """INSERT INTO AG_PERMISSOES(
                                CODIGO_USUARIO,
                                PERM_ALTERACAO,
                                PERM_EXCLUSAO ,
                                PERM_GRAFICO,
                                PERM_INCLUIR,
                                PERM_VISUALIZAR_LOGIN
                            ) VALUES ( 
                                %(CodigoUsuario)s,
                                %(Alterar)s,
                                %(Excluir)s,
                                %(Grafico)s,
                                %(Incluir)s,
                                %(Visualizar)s
                            ) """

                cx.conectar()

                resul = cx.executa(sql2, param, True)
        cx.desconectar()
        return resul

    def alterar_usuario_portal(self, param):
        cx = Conexao()
        cx.conectar()
        usuario = CadastrarUsuarioPortalDAO()
        f = Funcoes()

        sqlSenha = ''

        if 'SenhaUsuario' in param:
            if param['SenhaUsuario'] != '':
                senhaExiste = usuario.verifica_senha_usuario(param)
                if senhaExiste != []:
                    if int(senhaExiste[0]['CODIGO']) != int(param['CodigoUsuario']):
                        return {'Mensagem': 'Senha Cadastrada para outro Usuário.\nPor favor, digite uma nova Senha!',
                                'TipoRetorno': 'info'}
                else:
                    if len(param['SenhaGestor']) != 5:
                        return {'Mensagem': 'Senha deve possuir 5 dígitos!', 'TipoRetorno': 'info'}

                    sqlSenha = ", SENHA =%(SenhaUsuario)s "
            else:
                del param['SenhaUsuario']

        update = f"""
                 """
        resul = cx.executa(update, param, True)
        ret = f.trata_retorno_oracle(resul, 'Cadastro Usuário alterado com sucesso!',
                                     'Não foi possível Alterar o cadastro do Usuário!')

        return ret

    def verifica_usuario_existente(self, param):
        cx = Conexao()
        cx.conectar()
        sql = """
            SELECT CPF
            FROM AG_USUARIO_PORTAL
            WHERE  CPF = %(Cpf)s
        """
        usuario = cx.select(sql, param)

        return usuario

    def verifica_senha_usuario(self, param):
        cx = Conexao()
        cx.conectar()

        sql = """ SELECT * FROM AG_USUARIO_PORTAL  WHERE  SENHA = %(SenhaUsuario)s """

        usuario = cx.select(sql, param)

        return usuario