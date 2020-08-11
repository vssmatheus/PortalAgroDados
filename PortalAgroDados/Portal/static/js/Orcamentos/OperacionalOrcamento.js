var GRID_CONVENIADAS = [];
var CONVENIADAS_INCLUIDAS = [];

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

function populaOrcGrid() {
    if (ORC_GRID == []){
        retornaTabela({
            cabecalho: ['Orc.', 'Agrupador', 'Status', 'Estabelecimento', 'Produtos', 'Desconto', 'Total'],
            id_table: 'div-lista-orcamentos-agrupados-tab',
            div_table: 'div-lista-orcamentos-agrupados',
         });
    }else {
        retornaTabela({
            cabecalho: ['Orc.', 'Agrupador', 'Status', 'Estabelecimento', 'Produtos', 'Desconto', 'Total'],
            id_table: 'div-lista-orcamentos-agrupados-tab',
            campos_data: ['CODIGO', 'AGRUPADOR', 'STATUS', 'CONVENIADA', 'PRODUTOS', 'DESCONTO', 'TOTAL_ORCAMENTO'],
            dados: ORC_GRID,
            div_table: 'div-lista-orcamentos-agrupados',
            link_table: ['orcamentoGerados', 'CODIGO']
        });
    }
}

function orcamentoGerados(codigo) {
    window.location = '/ConsultarOrcamento/' + codigo;
}

function consultaConveniadasSolicitarOrc() {
    CONVENIADAS_INCLUIDAS = [];
    loadDiv('div-card-consulta-estabelecimento', 'B');
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
        url: '/ListarEstabelecimentosCredenciados',
        data: {"Uf": $("#estados").val(),
               "Cidade": $("#cidades").val(),
               "NomeConveniada": $("#estabelecimentos").val(),
                "CodigoOrcamento" : CODIGO_ORCAMENTO
        },
        success: function(data){
            loadDiv('div-card-consulta-estabelecimento', 'L');
            GRID_CONVENIADAS = data.Relacao;
            montaTabelaConveniadas();

        },error: function(data){
            GRID_CONVENIADAS = [];
            erroProcessarDados(data);
        }


    });
}

function incluiConveniada(dadosConveniada){
    var conveniada = [];

    conveniada = CONVENIADAS_INCLUIDAS.find( i => parseInt(i.CODIGO_TERMINAL) === parseInt(dadosConveniada.CODIGO_TERMINAL) );

    if (conveniada == [] || conveniada === undefined){
        CONVENIADAS_INCLUIDAS.push(dadosConveniada)
    }else{
        CONVENIADAS_INCLUIDAS.splice((CONVENIADAS_INCLUIDAS.map(function(c) { return c.CODIGO_TERMINAL; })
                         .indexOf(conveniada['CODIGO_TERMINAL'])), 1);
    }


}

function montaTabelaConveniadas(checked=false){

    var isCheck = checked ? "checked" : "";
    for (var i = 0; i< GRID_CONVENIADAS.length; i++){
        GRID_CONVENIADAS[i]['SELECT'] = '';
        var dadosCnv = String(JSON.stringify(GRID_CONVENIADAS[i])).replace(/"/g, '\'');
        GRID_CONVENIADAS[i]['SELECT'] = `
            <label class="display-inline-block custom-control custom-checkbox">
                        <input class="custom-control-input conveniadas_selecionada-solicita checked123"${GRID_CONVENIADAS[i].CODIGO_TERMINAL} onclick="incluiConveniada(${dadosCnv})" name="conveniada_${GRID_CONVENIADAS[i].CODIGO_TERMINAL}" id="conveniada_selecionada${GRID_CONVENIADAS[i].CODIGO_TERMINAL}" type="checkbox" ${isCheck} value='${GRID_CONVENIADAS[i].CODIGO_TERMINAL}'>
                        <span class="c-indicator bg custom-control-indicator"></span>
                        <span class="custom-control-description"></span>
                        </label>`
    }

    retornaTabela({
           cabecalho:['Todos','Estabelecimento','CNPJ', 'Telefone', 'Endereço', 'Cidade'],
           id_table: 'div-lista-estabelecimentos-orcamento-tab',
           campos_data: ['SELECT','NOME_CONVENIADA','CNPJ', 'TELEFONE', 'ENDERECO', 'CIDADE'],
           dados: GRID_CONVENIADAS,
           div_table: 'div-lista-estabelecimentos-orcamento'
    });

    $('#dataTablediv-lista-estabelecimentos-orcamento-tab thead tr').each(function () {
        var cabecalho = $(this).children();

        $(cabecalho[0]).replaceWith( `
                <th style="text-align:center">
                    <label class="display-inline-block custom-control custom-checkbox">
                        <input  class="custom-control-input marcar-todos-conveniada-slc-orc" id="marcar-todos-conveniada-slc-orc" onclick="marcaTodos()" type="checkbox" ${isCheck} >
                        <span class="c-indicator bg custom-control-indicator"></span>
                        <span class="custom-control-description">Todos</span>
                    </label>
                </th> `)
    });
}

function marcaTodos() {
    if($("#marcar-todos-conveniada-slc-orc").is(':checked')){
        CONVENIADAS_INCLUIDAS = GRID_CONVENIADAS;
        montaTabelaConveniadas(true);
    }else{
        CONVENIADAS_INCLUIDAS =[];
        montaTabelaConveniadas(false);
    }

}



