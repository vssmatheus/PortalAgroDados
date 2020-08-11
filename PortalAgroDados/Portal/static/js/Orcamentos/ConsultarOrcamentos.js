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

function onchangeCentroCusto(){
    alteraDepartamentoPorCentroCusto("centro_custo", "departamentos" );
}

function onchangeUf() {
    altera_cidade_por_uf("estados", "cidades" );
    onchangeCidades();
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

function buscaOrcamento(tipo='') {
    var param = {}
    if (tipo == "CLI"){
        param = {"DataInicial": $("#data_inicial").val(),
                 "DataFinal": $("#data_final").val(),
                 "CodigoOrcamento" : $("#orcamento").val(),
                 "CodigoAgrupador" : $("#agrupador").val(),
                 "Status": $("#status_orcamento").val(),
                 "NomeCartao": $("#nome_cartao").val(),
                 "TipoOrcamentos": $("#tipo_orcamento").val(),
                 "CentroCusto":$("#centro_custo").val(),
                 "Departamentos": $("#departamentos").val(),
                 "Uf": $("#estados").val(),
                 "Cidade": $("#cidades").val(),
                 "CodigoTerminal": $("#estabelecimento").val(),
            };
    }else if (tipo == "CNV"){
        param = {"DataInicial": $("#data_inicial").val(),
                 "DataFinal": $("#data_final").val(),
                 "CodigoOrcamento" : $("#orcamento").val(),
                 "CodigoAgrupador" : $("#agrupador").val(),
                 "Status": $("#status_orcamento").val()
            };
    }else {
        return;
    }

    if (!validaDatasRelatorios ('data_inicial', 'data_final', true)){
        return;
    }

    loadDiv('div-card-consulta-orcamento', 'B');
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
            url: '/ListarOrcamentos',
            data: param,

            success: function(data){
                loadDiv('div-card-consulta-orcamento', 'L');
                $("#accordion-comparativo-de-orcamento-cv").empty();
                if(data.Relacao.length == 0) {
                    $("#accordion-comparativo-de-orcamento-cv").html('<h3 class="center">Nenhuma informação encontrada!</h3>');
                }else{

                    retornaAccordion({
                        'dados': data.Relacao,
                        'accordion': 'accordion-comparativo-de-orcamento-cv',
                        'titulo_accordion': ['STATUS'],
                        'titulos_table_head': ['Orc.', 'Agrup.', 'Cartão', 'Fornecedor', 'Cadastros', 'Prazo Resposta', 'Validade','Produtos', 'Desc.', 'Valor', 'NF'],
                        'dados_table_body': ['CODIGO', 'AGRUPADOR', 'NOME_CARTAO', 'CONVENIADA', 'DATA_CADASTRO', 'DATA_PRAZO_RESPOSTA', 'DATA_VALIDADE_ORCAMENTO', 'PRODUTOS', 'DESCONTO', 'TOTAL_ORCAMENTO', 'POSSUI_NF_PRODUTO_ICON'],
                        'alinhamento_table_head_body': ['center', 'center', 'center', 'center', 'center', 'right', 'right', 'right', 'right', 'center', 'center'],
                        'link_table':['buscaOrcamentoSelecionado']
                    });
                }
                $('#qnt_total').html(data.Relacao.length)
                saveInputSessionStorage('div-form-consulta-orc')
            },error: function(data){
                erroProcessarDados();
            }
    });
}

function buscaHistoricoOrcamentos () {
    if (!validaDatasRelatorios ('data_inicial', 'data_final', true)){
        return;
    }
    loadDiv('div-card-consulta-historico-orcamento', 'B');
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
            url: '/ListarHistoricoOrcamentos',
            data: {"DataInicial": $("#data_inicial").val(),
                   "DataFinal": $("#data_final").val(),
                   "NomeCartao": $("#nome_cartao").val(),
                   "CodigoOrcamento" : $("#orcamento").val(),
                   "CodigoAgrupador" : $("#agrupador").val(),
                   "CodigoTerminal": $("#estabelecimento").val()
            },

            success: function(data){
                loadDiv('div-card-consulta-historico-orcamento', 'L');
                $("#accordion-historico-de-orcamento").empty();
                if(data.Relacao.length == 0) {
                    $("#accordion-historico-de-orcamento").html('<h3 class="center">Nenhuma informação encontrada!</h3>');
                }else{
                    retornaAccordion({
                            'dados': data.Relacao,
                            'accordion': 'accordion-historico-de-orcamento',
                            'titulo_accordion': ['CARTAO_ACCORDION'],
                            'titulos_table_head': ['Cartão', 'Data Cadastros', 'Estabelecimento', 'Orçamento', 'Agrupador','Data Alteração', 'Status De.', 'Status Para'],
                            'dados_table_body': ['CARTAO', 'DATA_CADASTRO', 'NOME_CONVENIADA', 'CODIGO_ORCAMENTO', 'AGRUPADOR', 'DATA_ALTERACAO', 'STATUS_DE', 'STATUS_PARA'],
                            'alinhamento_table_head_body': ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
                            'link_table': ['abreOrcamento', 'CODIGO_ORCAMENTO']
                        });
                    insere_icon_nf();
                }
            },error: function(data){
                erroProcessarDados(data);
            }
        });
}

function buscaHistoricoOrcamentoSelecionado(data) {
    window.location = '/ConsultarOrcamento/'+data.CODIGO_ORCAMENTO;
}

function buscaNFOrcamento(data){
    if (data.POSSUI_NF_PRODUTO == 'S'){
         window.location = '/ConsultaNFProduto/'+data.CODIGO;
    }
}

function buscaOrcamentoSelecionado(dadosOrcamento ) {
      $("td").click(function () {
        let valueClicked = $(this).html();
        if (String(valueClicked).toUpperCase().includes("ICON-PAPER-CLIP")) {
            mostraNF(valueClicked.split("value")[1].replace(/\D/g, ""));
            return;
        } else {
            abreOrcamento(dadosOrcamento.CODIGO);
            return;
        }
    });
}

function mostraNF(codigoOrc){
    window.open('/ConsultaNFProduto/' + codigoOrc, '_blank')
   //buscarorcamentosRelatorios();
}

function abreOrcamento(codigoOrc){
    // loadDiv('div-card-consulta-orcamento', 'B');
    window.location = '/ConsultarOrcamento/' + codigoOrc;
}

function gravaNumeroNFProduto(){

    if($("#numero_nota_produto").val() == ''){
        swal("","Por favor, informe o número da Nota Fiscal de Produto! ","warning");
        return;
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
        url: "/AtualizarOrcamento",
        data: { 'CodigoOrcamento': CODIGO_ORCAMENTO,
                'DocFiscal': $("#numero_nf").val(),
                'TipoAlteracaoOrcamento' : 'DOC_FISCAL'
            },
        success: function(data){
            swal("", data.Mensagem, data.Tipo)
            console.log(data);
        },error: function(data){
            console.log('erro ao registra Documento Fiscal do Orçamento');
            console.log(data);
        }
    });
}

