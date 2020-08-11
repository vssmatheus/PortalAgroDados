var CODIGO_ORC  = 0;
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

function buscaReimpressaoComprovante() {
    CODIGO_ORC = $("#orcamento").val()
    if (!validaDatasRelatorios ('data_inicial', 'data_final', true)){
        return;
    }

    loadDiv('div-card-consulta-comprovante', 'B');
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
        url: "/ListarReimpressaoComprovanteTrasacao",
        data: {"DataInicial": $("#data_inicial").val(),
               "DataFinal": $("#data_final").val(),
               "CodigoOrcamento": CODIGO_ORC,
               "NotaFiscalProduto": $("#nota_fiscal").val(),
               "Departamentos": $("#departamentos").val(),
               "NomeGestor": $("#gestor").val()},
        success: function(data){
            loadDiv('div-card-consulta-comprovante', 'L');
            retornaTabela({
                   cabecalho:['Data', 'Estabelecimento','Cartão', 'Orçamento', 'Histórico', 'Aut.', 'Gestor', 'N.F Produtos', 'Valor'],
                   id_table: 'consultar-comprovante-transacao-tab',
                   campos_data:['DATA_LANCAMENTO', 'NOME_CONVENIADA', 'NOME_CARTAO', 'CODIGO_ORCAMENTO', 'HISTORICO', 'CODIGO_AUTORIZACAO', 'NOME_GESTOR', 'DOC_FISCAL', 'VALOR_VENDA'],
                   dados: data.Relacao,
                   div_table: 'div-consultar-comprovante-transacao',
                   link_table: ['reimpressaoComprovanteVenda']

            });
            $('#valor_total').html(data.soma_rodape_valor_venda);
        },error: function(data){
            erroProcessarDados(data);
        }
    });
}

function reimpressaoComprovanteVenda(dados){
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
        url: "/ReimpressaoComprovanteVenda",
        data: dados,
    success: function (data) {
        abreModalRelatorio("Relatórios",data.url.replaceAll('&amp;','&'));
    }, error: function (data) {
        console.log("error");
        }
    });

}

