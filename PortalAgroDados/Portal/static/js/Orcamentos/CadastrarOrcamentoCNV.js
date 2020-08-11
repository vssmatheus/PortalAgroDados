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

function registrarDataEntrega(){
    if($("#data_entrega").val() == ''){
        swal("","Por favor, preencher a Data de Entrega dos produtos! ","warning");
        return;
    }

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
                'DataEntrega': $("#data_entrega").val(),
                'TipoAlteracaoOrcamento' : 'DATA_ENTREGA'
            },
        success: function(data){

            console.log(data);
            reloadAfterSwal(data.Tipo, data.Mensagem);

        },error: function(data){
            console.log('erro ao registra Data Entrega do Orçamento');
            console.log(data);
        }
    });

}

function recusarOrcamento() {
    var mensagemAlerta = "Tem certeza que deseja Recusar o Orçamento: " + CODIGO_ORCAMENTO +  "\nEmpresa: " + $("#nome_cliente_orcamento").html() + "?"
    swal({
        title: "",
        text: mensagemAlerta,
        type:"info",
        confirmButtonClass: "btn-danger",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        dangerMode : true
    }, function(isConfirm){
        if (isConfirm) {
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
                        'TipoAlteracaoOrcamento' : 'RECUSAR'
                    },
                success: function(data){

                    console.log(data);
                    reloadAfterSwal(data.Tipo, data.Mensagem);

                },error: function(data){
                    console.log('erro ao Recusar Orçamento', "warning");
                    console.log(data);
                }
            });
        }
    });
}

function enviarRespostaOrcamento(){
    if($("#data_validade").val() == ''){
        swal("","Data de Validade do Orçamento não está preenchida! ","warning");
        return;
    }
    if($("#data_previsao_entrega").val() == ''){
        swal("","Data Previsão de Entrega do Orçamento não está preenchida! ","warning");
        return;
    }

    if($("#data_previsao_entrega").val() == ''){
        swal("","Valores dos Produtos não foram preenchidos. Preencha-os antes de enviar a Cotação ","warning");
        return;
    }
    var mensagemAlerta = "Orçamento: " + CODIGO_ORCAMENTO +  "\nAlterado com Sucesso!"
    swal({
        title: "",
        text: mensagemAlerta,
        type:"info",
        showCancelButton: false,
        confirmButtonText: "OK"
    }, function(isConfirm){
        if (isConfirm) {
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
                url: "/AtualizarOrcamento",
                data: {
                    'CodigoOrcamento': CODIGO_ORCAMENTO,
                    'DataEntrega': $("#data_entrega").val(),
                    'DataPrevisaoEntrega': $("#data_previsao_entrega").val(),
                    'TipoAlteracaoOrcamento': 'ENVIAR_RESPOSTA'
                },
                success: function (data) {

                    console.log(data);
                    reloadAfterSwal(data.Tipo, data.Mensagem);

                }, error: function (data) {
                    console.log('erro ao enviar respota Orçamento');
                    console.log(data);
                }
            });
        }
    });
}

function faturarTranVenda() {

}
