# -*- coding: UTF-8 -*-
from Cryptodome.Cipher import DES3, AES
from Cryptodome.Util.Padding import pad, unpad
import hashlib
import base64
from base64 import b64encode, b64decode

class SegurancaController:

    codRetorno = 0

    #teste de comentario
    def decriptApp(self, chave, palavra):
        try:
            m = hashlib.md5()
            m.update(chave.encode('utf-8'))
            cipher = DES3.new(m.digest(), DES3.MODE_ECB)
            dec = cipher.decrypt(base64.b64decode(palavra))
            dec = dec[:(len(dec) - dec[-1])]
        except Exception as erro:
            return {"CodRetorno": 22, "Mensagem": erro}
        return {"CodRetorno": 0, "Mensagem": dec.decode('utf-8')}

    def encript_app(self, chave, palavra):

        BS = DES3.block_size
        m = hashlib.md5()
        m.update(chave.encode('utf-8'))
        cipher = DES3.new(m.digest(), DES3.MODE_ECB)
        pad_size = BS - (len(palavra) % BS)
        enc = cipher.encrypt(palavra.encode('utf-8').ljust(len(palavra.encode('utf-8')) + pad_size,bytes(chr(pad_size).encode('utf-8'))))

        return base64.b64encode(enc).decode('utf-8')

    def encriptAES(self, chave, palavra):

        try:
            KEY = bytes(chave, 'utf-8')
            IV = bytes("1234567890123456", 'utf-8')
            encryption_suite = AES.new(KEY, AES.MODE_CBC, IV)

            palavra = palavra.encode('utf-8')
            palavra_pad = pad(palavra, 16)
            cipher_text = encryption_suite.encrypt(palavra_pad)
            teste = IV + cipher_text

            cipher_text_64 = b64encode(teste)
            cipher_text_64 = cipher_text_64.decode('utf-8')

        except Exception as erro:
            return {"CodRetorno": 22, "Mensagem": erro}

        return {"CodRetorno": 0, "Mensagem": cipher_text_64}

    def decriptAES(self, chave, palavra):

        try:
            KEY = bytes(chave, 'utf-8')
            IV = b64decode(palavra)[:16]

            decryption_suite = AES.new(KEY, AES.MODE_CBC, IV)

            palavra = b64decode(palavra)[16:]
            plain_text = decryption_suite.decrypt(palavra)

            palavra_pad = unpad(plain_text, 16)
            palavra = palavra_pad.decode('utf-8')

        except Exception as erro:
            return {"CodRetorno": 22, "Mensagem": erro}

        return {"CodRetorno": 0, "Mensagem": palavra}