/**var CODIGO_PRODUTO = ''; COMENTEI - SE NAO DER PROBLEMA / APAGAR**/
var ITEM_EDITAR = 0;

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

function buscaItemDescricao() {
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
        url: "/ConsultarProdutosDescricao",
        data: {"DescricaoProduto":$("#descricao_item_modal").val()},
        success: function(data){
            retornaTabela({
                   cabecalho:['Código', 'Descrição','Tipo Unidade'],
                   id_table: 'consulta-de-produtos-tab',
                   campos_data: ['CODIGO', 'DESCRICAO', 'UNIDADE_MEDIDA'],
                   dados: data.Relacao,
                   div_table: 'div-consulta-de-produtos',
                   link_table: ['selecionaItem', 'CODIGO', 'DESCRICAO', 'UNIDADE_MEDIDA']
            });
        },error: function(data){
            loadButton("btnConsultarItem", "Consultar");
            $("#descricao_produto").val('');
            swal("","Ocorreu um erro ao consultar do item!","error");
        }
    });
}

function limpaCampos() {
    $("#codigo_produto").val("");
    $("#descricao_produto").val("");
    $("#qtd_produto").val("");
    $("#tipo_unidade").val("");
    $("#marca").val("");
    $("#observacao_produto").val("");
    $("#valor_unitario_prod").val(),
    $("#valor_desc_prod").val(),
    $("#validade_item").val(),
    $("#tempo_garantia_prod").val(),
    $("#valor_total").val(),

    $("#btn-incluir-itens-grid").show();
    $("#btn-editar-itens-grid").hide();
    $("#btn-cancelar-itens-grid").hide();

   $('#div-lista-produtos').children().find('button').removeAttr("disabled");
    $("#btn-pesquisar-item").removeClass("disabled");

}


function montaJsonItensGrid() {

    var codigoProdutoGrid =  $("#codigo_produto").val();

    if  (PERMISSOES_STATUS['TipoLogin'] == 'CNV') {
        var itens = {
            'CODIGO_ORCAMENTO': CODIGO_ORCAMENTO,
            'CODIGO_PRODUTO': codigoProdutoGrid,
            'DESCRICAO_PRODUTO': $("#descricao_produto").val(),
            'UNIDADE_MEDIDA': $("#tipo_unidade").val(),
            'QTDE_PRODUTO': $("#qtd_produto").val(),
            'MARCA_PRODUTO': $("#marca").val(),
            'OBSERVACAO_PRODUTO': $("#observacao_produto").val(),
            'VALOR_UNITARIO_PRODUTO': $("#valor_unitario_prod").val(),
            'VALOR_DESCONTO_PRODUTO': $("#valor_desc_prod").val(),
            'DATA_VALIDADE_PRODUTO': $("#validade_item").val(),
            'VALOR_TOTAL_PRODUTO': $("#valor_total").val(),
            'EDITAR_PROD': `<button type="button" class="btn btn-default btn-menor-table tooltipsItens" data-toggle="tooltip" data-placement="top" title="" data-original-title="Editar
                                Item" onclick="operacoesGrid('E', ${codigoProdutoGrid})">  <i class="ft-edit" style="color: #0bb772;font-size: 1.4em;"></i>
                                </button>`
        }
    }else{
        var itens = {
            'CODIGO_ORCAMENTO':  CODIGO_ORCAMENTO,
            'CODIGO_PRODUTO': codigoProdutoGrid,
            'DESCRICAO_PRODUTO':  $("#descricao_produto").val(),
            'UNIDADE_MEDIDA':  $("#tipo_unidade").val(),
            'QTDE_PRODUTO':  $("#qtd_produto").val(),
            'MARCA_PRODUTO': $("#marca").val(),
            'OBSERVACAO_PRODUTO':  $("#observacao_produto").val(),
            'EDITAR_PROD': `<button type="button" class="btn btn-default btn-menor-table tooltipsItens" data-toggle="tooltip" data-placement="top" title="" data-original-title="Editar
                                    Item" onclick="operacoesGrid('E', ${codigoProdutoGrid})">  <i class="ft-edit" style="color: #0bb772;font-size: 1.4em;"></i>
                                    </button>`,
            'EXCLUIR_PROD': `<button type="button" class="btn btn-default btn-menor-table tooltipsItens" data-toggle="tooltip" data-placement="top" title="" 
                                     data-original-title="Excluir Item" onclick="operacoesGrid('D',  ${codigoProdutoGrid})"> <i class="ft-trash" style="color: #ff5723;font-size: 1.4em;"></i>
                                     </button>`,
            'PRECOS_PROD': `<a data-toggle="tooltip" data-placement="top" title="" class="ft-search" style="color: #ff5723;font-size: 18px;" 
                                data-original-title="Clique para visualizar o preço praticado." onclick="abreModalVariacaoPreco( ${codigoProdutoGrid}, '${$("#descricao_produto").val()}' )"> 
                            </a> `
        };
    }
    return itens
}

function selecionaItem(codigo,desc,unidadeMedida){
    $("#codigo_produto").val(codigo);
    $("#descricao_produto").val(desc);
    $("#tipo_unidade").val(unidadeMedida);
    $('#modalConsultaItens').modal('hide');
}

function validaDadosTabItens(codigoProduto) {
    if (!/^-?[\d.]+(?:e-?\d+)?$/.test(codigoProduto)){
        swal("ATENÇÃO!", "Por favor. Selecione um item!", "error")
        return false;
    }

    if ($("#qtd_produto").val() == '' || $("#qtd_produto").val() == 0){
        swal("","Por favor, preencher o campo Quantidade para validar a Adição do Produto","warning");
        return false;
    }

    var possuiNoGrid = 0


    try{
        possuiNoGrid = ITENS_GRID.find( i => i.CODIGO_PRODUTO == codigoProduto )['CODIGO_PRODUTO']
    }catch (e) {}
    if ( possuiNoGrid > 0) {
        swal("ATENÇÃO!", "Não é permitido incluir um item já cadastrado!", "error")
        return false;
    }


    return true;
}

function operacoesGrid(tipoOp, codigo_item=0) {
    var item = []

    if (tipoOp != 'I' && parseInt(codigo_item) > 0){
       item = ITENS_GRID.find( i => parseInt(i.CODIGO_PRODUTO) === parseInt(codigo_item) );
    } else{
        item = montaJsonItensGrid();
    }

    /* tipoOP:
    * AP -> APROVAR ITEM
    * E  -> EDITAR
    * D  -> EXCLUIR ITEM DO GRID
    * I  -> INCLUIR ITEM DO GRID
    * PC -> PREÇOS PRATICADOS
    * */
    if (tipoOp == 'D'){
        swal({
            title: "Deseja excluir este ítem?",
            text: item['DESCRICAO_PRODUTO'],
            type:"warning",
            confirmButtonClass: "btn-danger",
            showCancelButton: true,
            confirmButtonColor: "#04a54d",
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
            dangerMode : true
            },
            function(isConfirm){
                if (isConfirm){
                    if (CODIGO_ORCAMENTO > 0){
                        excluiItem(item);
                    }else{
                         ITENS_GRID.splice((ITENS_GRID.map(function(item) { return item.CODIGO_PRODUTO; })
                         .indexOf(item['CODIGO_PRODUTO'])), 1);
                         populaItensGrid();
                    }
                }
            });
    }else if(tipoOp == 'I'){
        if (validaDadosTabItens(item['CODIGO_PRODUTO'])){
            if (CODIGO_ORCAMENTO > 0) {
                inserirItem();
            }else {
                ITENS_GRID.push(item)
            }
            populaItensGrid();
            limpaCampos();
        }

    }else if(tipoOp == 'E'){
        $("#codigo_produto").attr("disabled","true");
        $("#descricao_produto").attr("disabled","true");
        $("#tipo_unidade").attr("disabled","true");
        $("#btn-pesquisar-item").addClass("disabled");
        $("#btn-incluir-itens-grid").hide();
        $("#btn-editar-itens-grid").show();
        $("#btn-cancelar-itens-grid").show();

        $("#codigo_produto").val(item["CODIGO_PRODUTO"]);
        $("#descricao_produto").val(item["DESCRICAO_PRODUTO"]);
        $("#observacao_produto").val(item["OBSERVACAO_PRODUTO"]);
        $("#qtd_produto").val(item["QTDE_PRODUTO"]);
        $("#tipo_unidade").val(item["UNIDADE_MEDIDA"]);
        $("#marca").val(item["MARCA_PRODUTO"]);

        $('#div-lista-produtos').children().find('button').attr("disabled","true");



        ITEM_EDITAR = item["CODIGO_PRODUTO"];
    }
}

function populaItensGrid( ) {
    var cabecalho = []
    var campos =[]

    if  (PERMISSOES_STATUS['AcaoProdutosGrid'] == 'EDITAR/EXCLUIR'){
        cabecalho = ['Editar','Excluir','Cód.', 'Seq.', 'Descrição', 'Marca', 'UN', 'Quantidade','Observação'];
        campos = ['EDITAR_PROD','EXCLUIR_PROD','CODIGO_PRODUTO', 'CODIGO_SEQUENCIAL', 'DESCRICAO_PRODUTO','MARCA_PRODUTO','UNIDADE_MEDIDA','QTDE_PRODUTO','OBSERVACAO_PRODUTO'];

    }else if (PERMISSOES_STATUS['AcaoProdutosGrid'] == 'APROVAR/REPROVAR'){
        cabecalho = ['Aprovar/Reprovar','Código', 'Seq.', 'Descrição', 'Marca', 'UN', 'Garantia', 'Validade', 'Qtd.', 'Vr. Unit.','Vr. Desconto','Vr. Total','Observação','Status'];
        campos = ['APROVAR_PROD','CODIGO_PRODUTO', 'CODIGO_SEQUENCIAL', 'DESCRICAO_PRODUTO','MARCA_PRODUTO','UNIDADE_MEDIDA','DATA_GARANTIA','DATA_VALIDADE_PRODUTO','QTDE_PRODUTO','VALOR_UNITARIO_PRODUTO','VALOR_DESCONTO_PRODUTO','VALOR_TOTAL_PRODUTO','OBSERVACAO_PRODUTO', 'STATUS'];
    }else if (PERMISSOES_STATUS['AcaoProdutosGrid'] == 'EDITAR'){
        cabecalho = ['Editar','Código', 'Seq.', 'Descrição', 'Marca', 'UN', 'Garantia', 'Validade', 'Qtd.', 'Vr. Unit.','Vr. Desconto','Vr. Total','Observação','Status'];
        campos = ['EDITAR_PROD','CODIGO_PRODUTO', 'CODIGO_SEQUENCIAL', 'DESCRICAO_PRODUTO','MARCA_PRODUTO','UNIDADE_MEDIDA','DATA_GARANTIA','DATA_VALIDADE_PRODUTO','QTDE_PRODUTO','VALOR_UNITARIO_PRODUTO','VALOR_DESCONTO_PRODUTO','VALOR_TOTAL_PRODUTO','OBSERVACAO_PRODUTO', 'STATUS'];

    }else { //if (PERMISSOES_STATUS['AcaoProdutosGrid'] == 'VISUALIZAR'){ ALTAREDO - CASO NAO VENHA PERMISSAO O ACESSO PODE OMENTE VIZUALIZAR
        cabecalho = ['Código', 'Seq.', 'Descrição', 'Marca', 'UN', 'Garantia', 'Validade', 'Qtd.', 'Vr. Unit.','Vr. Desconto','Vr. Total','Observação','Status'];
        campos = ['CODIGO_PRODUTO', 'CODIGO_SEQUENCIAL', 'DESCRICAO_PRODUTO','MARCA_PRODUTO','UNIDADE_MEDIDA','DATA_GARANTIA','DATA_VALIDADE_PRODUTO','QTDE_PRODUTO','VALOR_UNITARIO_PRODUTO','VALOR_DESCONTO_PRODUTO','VALOR_TOTAL_PRODUTO','OBSERVACAO_PRODUTO', 'STATUS'];

    }

    if (PERMISSOES_STATUS['PermiteVizualizarPrecoProdutos'] == 'S'){
         cabecalho.push('Vizualizar variação de preços');
         campos.push('PRECOS_PROD');
    }

    if (PERMISSOES_STATUS['StatusOrcamento'] == 'CA'){
        cabecalho.splice(cabecalho.indexOf('Seq.'), 1);
        campos.splice(campos.indexOf('CODIGO_SEQUENCIAL'), 1);
    }


    retornaTabela({
           cabecalho:cabecalho,
           id_table: 'div-lista-produtos-tab',
           campos_data: campos,
           dados: ITENS_GRID,
           div_table: 'div-lista-produtos',
           order_table : [ ['CODIGO_SEQUENCIAL', 'ASC'] ]
    });
}

function editaItem( ) {
    var item = montaJsonItensGrid();

    if (CODIGO_ORCAMENTO > 0){
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
            url: "/AlterarItem",
            data: {
                "CodigoOrcamento": CODIGO_ORCAMENTO,
                'CodigoProduto': ITEM_EDITAR,
                'QuantidadeProduto': item["QTDE_PRODUTO"],
                'ValorProduto': item["VALOR_UNITARIO_PRODUTO"],
                'ValorDesconto': item["VALOR_DESCONTO_PRODUTO"],
                'DataValidadeProduto': item["DATA_VALIDADE_PRODUTO"],
                'MarcaProduto': item["MARCA_PRODUTO"],
                'ObservacaoProduto': item["OBSERVACAO_PRODUTO"],
                'DescricaoProduto': item["DESCRICAO_PRODUTO"],
                'TipoUnidade': item["UNIDADE_MEDIDA"]
            },
            success: function(data){
                swal("", data.Mensagem, data.Tipo)
                ITENS_GRID = data.Itens;
                populaItensGrid();
                limpaCampos();
            },error: function(data){
                console.log('erro ao cadastrar gestor');
                limpaCampos();
            }
        });
    }else{
        var pos = ITENS_GRID.map(function(item) { return item.CODIGO_PRODUTO; } ) .indexOf(item['CODIGO_PRODUTO'])
        console.log(pos)
        ITENS_GRID[pos] = item;
        populaItensGrid();
        limpaCampos();
    }


   // $("#btn-cancelar-itens-grid").hide();

}

function inserirItem(item) {
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
        url: "/InsereItem",
        data: {
            "CodigoOrcamento": CODIGO_ORCAMENTO,
            'CodigoProduto': $('#codigo_produto').val(),
            'QuantidadeProduto': $('#qtd_produto').val(),
            'MarcaProduto': $('#marca').val(),
            'ObservacaoProduto': $('#observacao_produto').val()
        },
        success: function(data){
            swal("", data.Mensagem, data.Tipo)
            ITENS_GRID = data.Itens;
            populaItensGrid();
        },error: function(data){
            console.log('erro ao cadastrar gestor');
        }
    });
}

function excluiItem(item) {
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
            url: "/DeleteItem",
            data: {
                "CodigoOrcamento": CODIGO_ORCAMENTO,
                "CodigoProduto":  item["CODIGO_PRODUTO"],
                "QuantidadeProduto": item["QTDE_PRODUTO"]
            },
            success: function (data) {
                swal({
                title: "Excluido",
                text: "Item excluido com sucesso!",
                type: "success",
                showCancelButton: false,
                confirmButtonText: "OK",
                closeOnConfirm: true
                }, function(isConfirm) {
                    if (isConfirm) {
                        scrollTo('card-produtos');
                    }
                });
                ITENS_GRID = data.Itens;
                populaItensGrid();
                console.log(data.Itens)
            }, error: function (data) {
                limpaCampos();
                swal("", "Não foi possível excluir o Produto!", "error");
            }
        });
}

function aprovarItem(codigo, descricao) {
    swal({
        title: "Deseja aprovar este Produto?",
        text: descricao,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#04a54d",
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function(isConfirm) {

    });
}

function alteraTipoCotacao(){}



