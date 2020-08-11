####funcoes.js
#####function retornaAccordion(){}
Esta funcão retorna um accordion. Os parametros precisam ser o seguinte:

    1.'dados': data.Extrato, //Uma lista contendo os dados retornados do sql
    2.'accordion':'accordion-extrato-cartao-orc',//Nome da div onde irá ficar o accordion
    3.'titulo_accordion':['ID_ACORD_DATA_LANCAMENTO','ORCAMENTO'], //Corresponde a qtd de niveis do accordion
    4.'titulos_table_head':['Estabelecimento','Produto', 'Qtd.','Vlr.Peça','Vlr. M.O','Vlr. Desc','KM'], //Os valores que ficaram no cabeçalho da tabela do accordion
    5.'dados_table_body': ['ESTABELECIMENTO', 'DESCRICAO_ITEM', 'QUANTIDADE_ITEM','VALOR_PECAS','VALOR_SERVICOS','VALOR_DESCONTO','KM'],//Valores da sql que aparecera no conteudo da tabela
    6.'alinhamento_table_head_body': ['center', 'center', 'left','center','left','center','center','center','right','right','right','right'], //Valores para ordenar as colunas das tabelas. Este campo não é obrigatorio
    7.'link_table': ['chamaModalNFOrcamento','CODIGO_CARTAO'] //Se esta chave estiver presente, a tabela irá possuir um onclick. O nome da função que o onclick ira chamar tem que estar no primeiro parametro. Se não possuir um segundo parametro, toda linha cada linha da variavel 'dados' será o parametro. Um exemplo esta presente na tela de consulta de orçamentos. Caso queira parametros especificos, colocar o nome das chaves que vem na sql.