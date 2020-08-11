import os
from django.conf import settings
import MySQLdb
from collections import namedtuple
os.environ["NLS_LANG"] = "BRAZILIAN PORTUGUESE_BRAZIL.UTF8"

class Conexao:

    def __init__(self):
        self.host = 'mysql669.umbler.com'
        self.port = 41890
        self.user = 'tccagrodados'
        self.database = 'tccagrodados'
        self.password = 'agrodados'

    def conectar(self):
        try:

            #self.db = MySQLdb.connect(self.user, self.password, self.database, self.host, self.port)
            self.db = MySQLdb.connect(
            host='mysql669.umbler.com',
            user='tccagrodados',
            passwd='agrodados',
            db='tccagrodados',
            port=41890 )



        except MySQLdb.DatabaseError as e:
            error, _ = e.args
            if error.code == 1017:
                print('Problemas ao conectar no: {e}')
            else:
                print('Erro ao conectar ao banco: {e}')
            raise
        self.cursor = self.db.cursor()

    def desconectar(self):
        try:
            self.cursor.close()
            self.db.close()
        except MySQLdb.DatabaseError:
            pass

    def call_proc(self, proc_name, args, kargs=None):
        if not self.conectar():
            self.conectar()

        if kargs:
            teste = self.cursor.callproc(proc_name, args)
        else:
            teste = self.cursor.callproc(proc_name, args)

        self.desconectar()

        return teste

    def select(self, sql, bindvars=None, dicionario=True):
        # test db connection, reconnect if connection is not open
        if not self.conectar():
            self.conectar()

        self.executa(sql, bindvars=bindvars)
        if dicionario:
            results = self.dictfetchall()
        else:
            results = self.namedtuplefetchall(self.cursor)

        self.desconectar()

        return results

    def executa(self, sql, bindvars=None, commit=False):
        try:

            if bindvars:
                self.cursor.execute(sql, bindvars)
            else:
                self.cursor.execute(sql)

        except MySQLdb.DatabaseError as e:
            error = e.args[0]
            return {'CodigoErro':error.code, 'Mensagem':error.message,'Contexto':error.context}
            #raise

        if commit:
            self.db.commit()
            return {'RowsEffect':str(self.cursor.rowcount)}

    # retorna um dicionario
    def namedtuplefetchall(self, cursor):
        "Return all rows from a cursor as a namedtuple"
        desc = cursor.description
        nt_result = namedtuple('Result', [col[0] for col in desc])
        return [nt_result(*row) for row in cursor.fetchall()]

    # retorna json
    def dictfetchall(self):
        "Return all rows from a cursor as a dict"
       # teste = self.cursor.fetchall()
        try:
            columns = [col[0] for col in self.cursor.description]
        except Exception as e:
            error = e.args[0]
            print({'CodigoErro': error.code, 'Mensagem': error.message, 'Contexto': error.context,
                   'PossivelErro': 'Alguma coisa a ver com data'})
        return [
            dict(zip(columns, row))
            for row in self.cursor.fetchall()
        ]