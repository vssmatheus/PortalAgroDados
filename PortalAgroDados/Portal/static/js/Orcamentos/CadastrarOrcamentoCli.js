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

function cadastrarOrcamentoCli(codigo_cartao = 0) {
    window.location = '/CadastrarOrcamento/'+codigo_cartao,'_parent'
}




function replicarOrcamento() {
    postAlterarOrcamento ({
        'CodigoOrcamento' : CODIGO_ORCAMENTO,
        'CodigoCartao' : CODIGO_CARTAO,
        'Conveniadas' : JSON.stringify(CONVENIADAS_INCLUIDAS),
        'TipoAlteracaoOrcamento' : 'REPLICAR'
    }, '', 'RE');
}

function cadastraOrcamento(status = 'SO'){
    var tipoAlteracao = '';
    if (CODIGO_ORCAMENTO == 0){
       tipoAlteracao = 'CADASTRAR';
    }else{
       tipoAlteracao = 'ALTERAR';
    }
    console.log(CONVENIADAS_INCLUIDAS);
    postAlterarOrcamento ({
        'CodigoCartao' : CODIGO_CARTAO,
        'StatusOrcamento' : status,
        'CodigoOrcamento' : CODIGO_ORCAMENTO,
        'RelatoGestor': $("#parecer_gestor").val(),
        'GestorResposavel': $("#gestor").val(),
        'FoneResponsavel' : $("#telefone_res").val(),
        'TempoRespostaOrcamento' : $("#tempo_resposta").val(),
        'TipoOrcamento' : 1,
        'Itens' : JSON.stringify(ITENS_GRID),
        'Conveniadas' : JSON.stringify(CONVENIADAS_INCLUIDAS),
        'TipoAlteracaoOrcamento' : tipoAlteracao
    }, 'TEM CERTEZA QUE DESEJA CADASTRAR O ORÇAMENTO?', status);


}


function cancelarOrcamento() {
    var mensagemAlerta = "Tem certeza que deseja Cancelar o Orçamento: " + CODIGO_ORCAMENTO +  "\nEstabelecimento:" + $("#nome_estabelecimento").html() +"\nValor Total: R$ ? \nDepois de Cancelado não poderá desfazer!"
    postAlterarOrcamento ({
            'CodigoOrcamento': CODIGO_ORCAMENTO,
            'CodigoCartao' : CODIGO_CARTAO,
            'RelatoGestor': $("#parecer_gestor").val(),
            'TipoAlteracaoOrcamento' : 'CANCELAR'
    }, mensagemAlerta);
}

function reprovarOrcamento() {
    var mensagemAlerta = "Tem certeza que deseja Reprovar o Orçamento: " + CODIGO_ORCAMENTO +  "\nEstabelecimento:" + $("#nome_estabelecimento").html() +"\nValor Total: R$ ? \nDepois de Cancelado não poderá desfazer!"
    postAlterarOrcamento ({
        'CodigoOrcamento': CODIGO_ORCAMENTO,
        'CodigoCartao' : CODIGO_CARTAO,
        'RelatoGestor': $("#parecer_gestor").val(),
        'TipoAlteracaoOrcamento' : 'REPROVAR'
    }, mensagemAlerta);
}

function postAlterarOrcamento(dados, mensagemSwal, novoStatus = ''){

    if (!validaItensObrigatorios(novoStatus)){
        return;
    }
    if (mensagemSwal == ''){
        ajaxAlteracaoOrcamento(dados);
    }else {
        swal({
            title: "",
            text: mensagemSwal,
            type: "info",
            confirmButtonClass: "btn-danger",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
            dangerMode: true
        }, function (isConfirm) {
            if (isConfirm) {

                ajaxAlteracaoOrcamento(dados);

            }
        });
    }
}

function ajaxAlteracaoOrcamento(dados){
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
        data: dados,
        success: function(data){

            console.log(data);

            if (data.CodigoOrcamento){
                reloadAfterSwal(data.Tipo, data.Mensagem, '/ConsultarOrcamento/'+data.CodigoOrcamento);
            }else{
                reloadAfterSwal(data.Tipo, data.Mensagem, '')
            }


        },error: function(data){
            console.log('erro ao Cancelar Orçamento', "warning");
            console.log(data);
        }
    });
}

function validaItensObrigatorios(statusOrcamento = ''){

        if ($("#parecer_gestor").val().trim().length == 0 && statusOrcamento != 'SR'){
            return clickAftwerSwal("Informe o Parecer do Gestor!", "frmCadCartao-t-0");
        }else if ($("#gestor").val() == 'TD' || $("#gestor").val() == ''){
            return clickAftwerSwal("Informe Gestor Responsavel!", "frmCadCartao-t-0");
        } else if ($("#telefone_res").val().trim().length == 0 && statusOrcamento != 'SR'){
            return clickAftwerSwal("Informe telefone do Gestor Responsavel!", "frmCadCartao-t-0");
        }else if (ITENS_GRID.length <= 0){
            return clickAftwerSwal("Insira ao menos um item no Orçamento!", "frmCadCartao-t-1");
        }else if (CONVENIADAS_INCLUIDAS.length <= 0){
            return clickAftwerSwal("Escolha ao menos um estabelecimento!", "frmCadCartao-t-2");
        }


    return true;
}

function validaItensObrigatorios(statusOrcamento = ''){

        if ($("#parecer_gestor").val().trim().length == 0 && statusOrcamento != 'SR'){
            return clickAftwerSwal("Informe o Parecer do Gestor!", "frmCadCartao-t-0");
        }else if ($("#gestor").val() == 'TD' || $("#gestor").val() == ''){
            return clickAftwerSwal("Informe Gestor Responsavel!", "frmCadCartao-t-0");
        } else if ($("#telefone_res").val().trim().length == 0 && statusOrcamento != 'SR'){
            return clickAftwerSwal("Informe telefone do Gestor Responsavel!", "frmCadCartao-t-0");
        }else if (ITENS_GRID.length <= 0){
            return clickAftwerSwal("Insira ao menos um item no Orçamento!", "frmCadCartao-t-1");
        }else if (CONVENIADAS_INCLUIDAS.length <= 0){
            return clickAftwerSwal("Escolha ao menos um estabelecimento!", "frmCadCartao-t-2");
        }


    return true;
}

function clickAftwerSwal(mensagem, href="#"){
    swal({
        title: "ATENÇÃO",
        text: mensagem,
        type: "info",
        showCancelButton: false,
        allowEscapeKey : false,
        confirmButtonText: "OK"
    }, function(isConfirm){
        $('#'+href).trigger('click')
    });

    return false;

}
