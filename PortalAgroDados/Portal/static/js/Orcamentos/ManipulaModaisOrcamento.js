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

var PESQUISA_PRECO='EMPRESA';

$(document).ready(function() {

    $("#tab-variacao-precos-empresa").on("click", function () {
        PESQUISA_PRECO = 'EMPRESA';
        $("#div-consulta-de-variacao-tab").empty();


        $("#form-consulta-precos").removeClass("hide");
        $("#mensagem-variacao-preco-praticado").addClass("hide");

    })

    $("#tab-variacao-precos-empresa-orcamento").on("click", function () {
        PESQUISA_PRECO = 'ORCAMENTO';
        $("#div-consulta-de-variacao-tab").empty();

        $("#mensagem-variacao-preco-praticado").removeClass("hide");
        $("#form-consulta-precos").addClass("hide");

        $("#consultaPrecoPraticado").trigger('click');

    })
});

function abreModalFaturaVenda() {
    $("#modalFaturarTranVendas").modal();
}

function abreModalConsultaItens() {
    $("#modalConsultaItens").modal();
}

function abreModalVariacaoPreco(codigoProduto, descricaoProduto) {
    $("#modalPrecoPraticadoEmpresa").modal();
     $('#nome_produto_relatorio').html('CONSULTAR VARIAÇÃO DE PREÇOS - '+descricaoProduto);

    $("#consultaPrecoPraticado").attr('onclick', `consultaPrecosPraticado(${codigoProduto})`)
}

function consultaPrecosPraticado (codigoProduto) {
    loadDiv("div-para-load", "B");
    var urlPost = '';
    var cabecalho = [];
    var campos = [];
    var dados = '';

    switch (PESQUISA_PRECO) {
        case "EMPRESA":
            urlPost = "/ConsultaPrecoPraticadoEmpresa";
            campos = ['CODIGO_ORCAMENTO', 'NOME_CARTAO', 'DATA_CADASTRO', 'CONVENIADA', 'STATUS','MARCA_PRODUTO', 'QUANTIDADE_PRODUTO', 'VALOR_UNITARIO_PRODUTO', 'VALOR_DESCONTO_PRODUTO', 'VALOR_TOTAL'];
            cabecalho = ['Cód. Orc.', 'Nome Cartão','Cadastros', 'Estabelecimento', 'Status', 'Marca', 'Qtd.', 'Produto','Desconto', 'Total'];
            dados = {   'CodigoOrcamento': CODIGO_ORCAMENTO,
                        'CodigoProduto': codigoProduto,
                        'DataInicial': $("#data_inicial_cadastro").val(),
                        'DataFinal' :$("#data_final_cadastro").val() }
            break;
        case "ORCAMENTO":
            urlPost = "/VariacaoPrecoPraticado";
            campos = ['NOME_CARTAO', 'DESCRICAO', 'QUANTIDADE_PRODUTO', 'VALOR_UNITARIO_PRODUTO', 'VALOR_DESCONTO_PRODUTO', 'VALOR_TOTAL', 'NOME_CONVENIADA','ESTADO'];
            cabecalho = ['Nome Cartão','Descrição',  'Qtd.', 'Produto','Desconto', 'Total', 'Estabelecimento', 'Estado'];
            dados = {   'CodigoOrcamento': CODIGO_ORCAMENTO,
                        'CodigoProduto': codigoProduto };
            break;
        default:
            return;
            break;
    }

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
        url: urlPost,
        data: dados,
        success: function(data){
        loadDiv("div-para-load", "A");
            retornaTabela({
                   cabecalho:cabecalho,
                   campos_data: campos,
                   dados: data.Relacao,
                   id_table: 'div-consulta-de-variacao-tab',
                   div_table: 'div-consulta-de-variacao'
            });

        },error: function(data){
            console.log('erro.consultaPrecosPraticado!');
        }
    });

}


