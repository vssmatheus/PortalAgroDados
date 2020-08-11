var ROTAS = '';
var DADOS_RELATORIO = [];

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function onchangeCidades() {
    var eUF = document.getElementById("estados");
    var eCidade = document.getElementById("cidades");

    var uf = eUF.options[eUF.selectedIndex].value;
    var cidade = eCidade.options[eCidade.selectedIndex].value;

    if (cidade.toUpperCase().search("CARREGAND") > -1){
        cidade= '';
    }

    $("#estabelecimento").html("<option>Carregando...</option>");
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.ajax({
        dataType:"json",
        type: "POST",
        url: "/ConsultaEstabelecimentos",
        data:  {"Uf": uf, "Cidade" : cidade },

        success: function(data){
            $("#estabelecimento").empty();
            $("#estabelecimento").html("<option value='TD'>TODOS</option>");
            for(var i in data.Estabelecimentos){
                $("#estabelecimento").append(`<option value="`+data.Estabelecimentos[i].CODIGO_TERMINAL+`">`+data.Estabelecimentos[i].NOME+`</option>`);
            }
        },error: function(data){
            $("#estabelecimento").html("<option value='TD'>TODOS</option>");
        }
    });
}

function onchangeCentroCusto(){
    alteraDepartamentoPorCentroCusto("centro_custo", "departamentos" );
}

function validadorDeDatas() {
    if (ROTAS == 'RelacaoVendaPorEstabelecimento' || ROTAS == 'RankingDeProdutos' || ROTAS == 'ProdutosEmGarantia' || ROTAS == 'DemostrativoDeGastos' ||
        ROTAS == 'ComparativoDeOrcamento' || ROTAS == 'DemonstrativoExtratoDeVendas'){
         if (!validaDatasRelatorios ('data_inicial', 'data_final', true)){
            return;
         }
    }

}

function relatoriosOrcamento() {
    validadorDeDatas();
    loadDiv('div-card-consulta-relatorio', 'B');
    DADOS_RELATORIO = objetoRelatorio()[ROTAS]();
    DADOS_RELATORIO['dados']['Rota'] = ROTAS;


    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.ajax({
        dataType:"json",
        type: "POST",
        url: '/ConsultaRelatorios',
        data: DADOS_RELATORIO['dados'],
        success: function(data){
            console.log(data)
            loadDiv('div-card-consulta-relatorio', 'L');
            DADOS_RELATORIO = objetoRelatorio()[ROTAS](data);
            // VERIFICA SE O OBJETO ESTA VAZIO

            if(data.Relacao.length == 0) {
                $("#accordion-relatorios-orcamento").html('<h3 class="center">Nenhuma informação encontrada!</h3>');
                $("#div-accordion").removeClass('hide');
                $("#dataTablediv-relatorios-orcamento-tab").DataTable().clear().draw();
                $("#div-tabela").addClass('hide');
            }else {
                // MONTA TABELA
                if (DADOS_RELATORIO['isTable']) {
                    $("#div-accordion").addClass('hide');
                    $("#div-tabela").removeClass('hide');
                    retornaTabela({
                        cabecalho: DADOS_RELATORIO['cabecalho'],
                        campos_data: DADOS_RELATORIO['campos'],
                        dados: data.Relacao,
                        id_table: 'div-relatorios-orcamento-tab',
                        div_table: 'div-relatorios-orcamento'
                    });

                } else {
                    $("#div-tabela").addClass('hide');
                    $("#div-accordion").removeClass('hide');

                    $("#accordion-relatorios-orcamento").empty();
                    retornaAccordion({
                        'dados': data.Relacao,
                        'accordion': 'accordion-relatorios-orcamento',
                        'titulo_accordion': DADOS_RELATORIO['niveis_accordion'],
                        'titulos_table_head': DADOS_RELATORIO['titulo_tabela'],
                        'dados_table_body': DADOS_RELATORIO['dados_tabela'],
                        'alinhamento_table_head_body': DADOS_RELATORIO['alinhamento_tabela'],
                        'link_table': DADOS_RELATORIO['link'],
                    });
                }
            }
            saveInputSessionStorage('filtros-compartivo-orc')
        },error: function(data){
            erroProcessarDados(data);
        }
    });

}

function objetoRelatorio(){
   var object = {};
   return {
        ComparativoDeOrcamento_ANALISE(data){
            object['niveis_accordion'] = ['DEPARTAMENTO', 'NOME_CARTAO', 'AGRUPADOR'];
            object['titulo_tabela'] = ['Orc.', 'Staus', 'Fornecedor', 'Cadastros', 'Validade', 'Produtos', 'Desc.', 'Valor'];
            object['dados_tabela'] = ['CODIGO', 'STATUS', 'CONVENIADA', 'DATA_CADASTRO', 'DATA_VALIDADE_ORCAMENTO', 'PRODUTOS', 'DESCONTO', 'TOTAL_ORCAMENTO'];
            object['alinhamento_tabela'] = ['center', 'center', 'center', 'center', 'center', 'right', 'right', 'right'];
            object['link'] = ['abreOrcamento', ['CODIGO']];
            object['dados'] = {
                "DataInicial": $("#data_inicial").val(),
                "DataFinal": $("#data_final").val(),
                "CodigoOrcamento": $("#orcamento").val(),
                "CodigoAgrupador": $("#agrupador").val(),
                "Status": $("#status_orcamento").val(),
                "NomeCartao": $("#nome_cartao").val(),
                "TipoOrcamentos": $("#tipo_orcamento").val(),
                "CentroCusto":$("#centro_custo").val(),
                "DescCentroCusto":$("#centro_custo option:selected").html(),
                "Departamento":$("#departamentos").val(),
                "DescDepartamento":$("#departamentos option:selected").html(),
                "Uf": $("#estados").val(),
                "Cidade": $("#cidades").val(),
                "CodigoTerminal": $("#estabelecimento").val(),
            };
            if (data){
                $('#qnt_total').html(data.Relacao.length);
            }
            return object;
        },

        ComparativoDeOrcamento_CONSULTA(data){
            object['niveis_accordion'] = ['STATUS'];
            object['titulo_tabela'] = ['Orc.', 'Cartão', 'Fornecedor', 'Cadastros', 'Prazo Resposta', 'Validade','Produtos', 'Desc.', 'Valor', 'NF'];
            object['dados_tabela'] = ['CODIGO', 'NOME_CARTAO', 'CONVENIADA', 'DATA_CADASTRO', 'DATA_PRAZO_RESPOSTA', 'DATA_VALIDADE_ORCAMENTO','PRODUTOS', 'DESCONTO', 'TOTAL_ORCAMENTO', 'POSSUI_NF_PRODUTO_ICON'];
            object['alinhamento_tabela'] = ['center', 'center', 'center', 'center', 'center', 'center', 'right', 'right', 'right'];
            object['link'] = ['buscarorcamentosRelatorios'];
            object['dados'] = {
                "DataInicial": $("#data_inicial").val(),
                "DataFinal": $("#data_final").val(),
                "CodigoOrcamento": $("#orcamento").val(),
                "CodigoAgrupador": $("#agrupador").val(),
                "Status": $("#status_orcamento").val(),
                "NomeCartao": $("#nome_cartao").val(),
                "TipoOrcamentos": $("#tipo_orcamento").val(),
                "CentroCusto":$("#centro_custo").val(),
                "DescCentroCusto":$("#centro_custo option:selected").html(),
                "Departamento":$("#departamentos").val(),
                "DescDepartamento":$("#departamentos option:selected").html(),
                "Uf": $("#estados").val(),
                "Cidade": $("#cidades").val(),
                "CodigoTerminal": $("#estabelecimento").val(),
            };
            if (data){
                $('#qnt_total').html(data.Relacao.length);
            }
            return object;
       },

        DemostrativoDeGastos(data){

            object['niveis_accordion'] = ['CENTRO_CUSTO', 'DEPARTAMENTO', 'DATA_LANCAMENTO'];
            object['titulo_tabela'] = ['Nome Cartão','Cód. Orc.', 'Status', 'Estabelecimento', 'CNPJ', 'N.F Produto', 'Valor'];
            object['dados_tabela'] = ['NOME_CARTAO','CODIGO_ORCAMENTO', 'STATUS', 'NOME_CONVENIADA', 'CNPJ', 'DOC_FISCAL', 'PRODUTOS'];
            object['alinhamento_tabela'] = ['center', 'center', 'center', 'center', 'center', 'right', 'right'];
            object['dados'] = {
                "DataInicial": $("#data_inicial").val(),
                "DataFinal": $("#data_final").val(),
                "NomeCartao": $("#nome_cartao").val(),
                "CodigoOrcamento" : $("#orcamento").val(),
                "NotaFiscalProduto" : $("#n_produto").val(),
                "TipoOrcamentos": $("#tipo_orcamento").val(),
                "CentroCusto":$("#centro_custo").val(),
                "DescCentroCusto":$("#centro_custo option:selected").html(),
                "Departamento":$("#departamentos").val(),
                "DescDepartamento":$("#departamentos option:selected").html(),
                "CodigoTerminal": $("#estabelecimento").val()
            };

            if (data) {
                $('#qnt_total').html(data.soma_rodape_produto_venda);
                $('#total_desconto').html(data.soma_rodape_desconto_venda);
                $('#valor_total').html(data.soma_rodape_valor_venda);
            }
            return object;
        },

        ProdutosEmGarantia(data) {
            object['niveis_accordion']  = ['NOME_CARTAO'];
            object['titulo_tabela'] = ['Estabelecimento','Orc.', 'Cód', 'Descrição Produto', 'Marca', 'Garantia', 'Status', 'QTD', 'Vr. Unit.', 'Desc.', 'Total'];
            object['dados_tabela'] = ['CONVENIADA','CODIGO_ORCAMENTO', 'CODIGO_PRODUTO', 'DESCRICAO_PRODUTO', 'MARCA_PRODUTO', 'DATA_GARANTIA_PRODUTO', 'STATUS_GARANTIA',
                                'QTDE_PRODUTO', 'VLR_PRODUTO', 'DESC_PROD', 'TOTAL'];
            object['alinhamento_tabela'] = ['center', 'center', 'center', 'center', 'center', 'center', 'center','center', 'right', 'right', 'right'];
            object['dados'] = {"DataInicial": $("#data_inicial").val(),
                   "DataFinal": $("#data_final").val(),
                   "NomeCartao": $("#nome_cartao").val(),
                   "CodigoOrcamento" : $("#orcamento").val(),
                   "CodigoTerminal": $("#estabelecimento").val()}

           return object;
        },

        RankingDeProdutos(data) {
            object['isTable'] = true;
            object['campos'] = ['DESCRICAO_PRODUTO', 'QTDE_PRODUTO', 'TOTAL_PRODUTO', 'PERCENTUAL'];
            object['cabecalho'] = ['Produto', 'Qunatidade','Valor Produto', 'Percentual'];
            object['dados'] = { "DataInicial": $("#data_inicial").val(),
                                "DataFinal": $("#data_final").val()}

            if (data) {
                $('#valor_total').html(data.soma_rodape_total_produto);
                $('#qnt_total').html(data.soma_rodape_qtde_produto);
            }
            return object;
        },

        RelacaoCentroDeCustoDepartamentos(data) {
            object['dados'] = {};
            object['niveis_accordion'] = ['DESCRICAO_CENTRO'];
            object['titulo_tabela'] = ['Centro de Custo', 'Departamento', 'Número Departamento'];
            object['dados_tabela'] = ['DESCRICAO_CENTRO', 'DEPARTAMENTO', 'NUMERO_DEPARTAMENTO'];
            object['alinhamento_tabela'] = ['center', 'center', 'center'];

            return object;
        },

        RelacaoSaldoPorEmpenho (data) {
            object['isTable'] = true;

            object['campos'] = ['SITUACAO_COLORIDO', 'CODIGO_LICITACAO', 'DATA_INICIAL', 'DATA_FINAL', 'VALOR_LICITACAO', 'SALDO_LICITACAO', 'CODIGO_EMPENHO', 'VALOR_FATURADO', 'VALOR_PROVISIONADO', 'VALOR_EMPENHO', 'SALDO_EMPENHO'];
            object['cabecalho'] = ['Situação', 'Código Licitação','Início', 'Final', 'Vlr. Licitação', 'Saldo Licitação', 'Código Empenho', 'Vlr. Faturado','Vlr. Provisionado', 'Vlr. Empenho', 'Saldo Empenho'];

            object['dados'] = {'Situacao': $("#status").val()}

            if ($("#departamentos").length){
                object['dados'] = {
                        'Situacao': $("#status").val(),
                        'Departamento':$("#departamentos").val(),
                        'DescDepartamento':$("#departamentos option:selected").html()
                    };
                object['campos'].push('DESCRICAO_DEPARTAMENTO');
                object['cabecalho'].push('Departamento');
            }
            return object;
        },

        RelacaoVendaPorEstabelecimento(data) {
            object['niveis_accordion'] = ['NOME_CONVENIADA'];
            object['titulo_tabela'] = ['Data', 'Orçamento', 'Produto', 'Desconto', 'Valor'];
            object['dados_tabela'] = ['DATA_LANCAMENTO', 'CODIGO_ORCAMENTO', 'VALOR_PRODUTOS', 'VALOR_DESCONTOS', 'VALOR_TOTAL'];
            object['alinhamento_tabela'] = ['center', 'center', 'right','right','right'];
            object['dados'] = {"DataInicial": $("#data_inicial").val(),
                               "DataFinal": $("#data_final").val(),
                               "CentroCusto":$("#centro_custo").val(),
                               "DescCentroCusto":$("#centro_custo option:selected").html(),
                               "Departamento":$("#departamentos").val(),
                               "DescDepartamento":$("#departamentos option:selected").html()}

            if (data) {
                $('#valor_total').html(data.soma_rodape_valor_total);
            }
            return object;
        },

        DemonstrativoExtratoDeVendas (data){
            object['isTable'] = true;
            object['campos'] = ['DATA_LANCEMENTOS', 'NOME_CARTAO', 'HISTORICO', 'AUTORIZACAO', 'CODIGO_ORCAMENTO', 'PLANO_FECHAMENTO', 'DATA_RECEBIMENTO', 'VALOR'];
            object['cabecalho'] = ['Lançamento', 'Nome Cartão','Histórico', 'Autorização', 'Orçamento', 'Plano', 'Data Recebimento', 'Valor'];
            object['dados'] = {   "DataInicial": $("#data_inicial").val(),
                                  "DataFinal": $("#data_final").val(),
                                  "CodigoOrcamento": $("#orcamento").val(),
                                  "CodigoAutorizacao": $("#autorizacao").val()}

            if (data) {
                $('#valor_total').html(data.soma_rodape_valor);
            }
            return object;
        }
    };
}

function GerarRelatoriosOrcamentos(dados='', relatorioComplementar='N') {
    DADOS_RELATORIO = objetoRelatorio()[ROTAS]();
    if (dados != ''){
        DADOS_RELATORIO['dados'] = dados;
    }

    if ( !(dados != '' && dados['Rota'])){
        DADOS_RELATORIO['dados']['Rota'] = ROTAS;
    }

    DADOS_RELATORIO['dados']['RelatorioComplementar'] = relatorioComplementar;

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.ajax({
        dataType: "json",
        type: "POST",
        async: false,
        url: "/RelatoriosOrcamentos",
        data: DADOS_RELATORIO['dados'],
        success: function (data) {
            abreModalRelatorio("Relatórios",data.url.replaceAll('&amp;','&'));
        }, error: function (data) {
            console.log("error");
        }
    });
}

function GerarRelatoriosDetalhesOrcamentos(tipoRelatorio = '') {

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.ajax({
        dataType: "json",
        type: "POST",
        async: false,
        url: "/RelatoriosDetalhesOrcamento",
        data: {'CodigoOrcamento' : CODIGO_ORCAMENTO,
                'TipoRelatorio' : tipoRelatorio
                },
    success: function (data) {
        abreModalRelatorio("Relatórios",data.url.replaceAll('&amp;','&'));
    }, error: function (data) {
        console.log("error");
        }
    });

}

function buscarorcamentosRelatorios(dados='') {

    $("td").click(function () {
        let valueClicked = $(this).html();
        if (String(valueClicked).toUpperCase().includes("ICON-PAPER-CLIP")) {
            dados['Rota'] = 'AbreNotaFiscal';
            GerarRelatoriosOrcamentos(dados);
            return;
        } else {
            dados['Rota'] = 'ComparativoDeOrcamento_CONSULTA';
            GerarRelatoriosOrcamentos(dados);
            return;
        }
    });
}

function abreOrcamento(codigoOrc){
    window.location = '/ConsultarOrcamento/' + codigoOrc;
}