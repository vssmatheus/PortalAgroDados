CREATE TABLE AG_USUARIO_PORTAL (
     CODIGO BIGINT(20) NOT NULL AUTO_INCREMENT,
     NOME VARCHAR(100) NOT NULL,
     EMAIL VARCHAR(70) NOT NULL,
     CPF VARCHAR(11) NOT NULL,
     MATRICULA VARCHAR(10) NOT NULL,
     SENHA VARCHAR(12) NOT NULL,
     LOGIN VARCHAR(30) NOT NULL,
     DATA_CADASTRO TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
     STATUS VARCHAR(1) NOT NULL,
     PRIMARY KEY (CODIGO)
);

ALTER TABLE AG_USUARIO_PORTAL ADD CONSTRAINT UN_CPF UNIQUE (CPF);

INSERT INTO AG_USUARIO_PORTAL (NOME, EMAIL, CPF, MATRICULA, SENHA, LOGIN, DATA_CADASTRO, STATUS)
VALUES ('Administrador', 'agrodados@gmail.com', '00000000191','12345','12345', 'admin', CURRENT_TIMESTAMP, 'A');

SELECT * FROM AG_USUARIO_PORTAL;

ALTER TABLE AG_USUARIO_PORTAL ADD STATUS DEFAULT 'A';