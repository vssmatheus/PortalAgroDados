from ....conexao import *
from ...Funcoes.Controller import Funcoes

class CadastrarUsuarioPortalDAO:
    def cadastrar_usuario_portal(self, param):
        cx = Conexao()
        cx.conectar()

        f = Funcoes()
        param['LoginUsuario'] = f.retira_caracteres(param['LoginUsuario']).replace(' ', '')
        param['NomeUsuario'] = f.retira_caracteres(param['NomeUsuario'])
        param['Cpf'] = f.somente_numeros(param['Cpf'])

        sql1 = """INSERT INTO AG_USUARIO_PORTAL (NOME, EMAIL, CPF, MATRICULA, SENHA, LOGIN )
                  VALUES (%(NomeUsuario)s, %(EmailUsuario)s, %(Cpf)s, %(Matricula)s, %(SenhaUsuario)s, %(LoginUsuario)s );
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
        pass