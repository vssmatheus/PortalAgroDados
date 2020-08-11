var CODIGO_GESTOR = 0;

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

function cadastrarGestor() {
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
        url: "/InsereGestores",
        data: {
            'NomeGestor': $('#nome_completo').val(),
            'Matricula': $('#matricula').val(),
            'Cpf': $('#cpf').val(),
            'Rg': $('#rg').val(),
            'OrgaoExpedidor': $('#orgao_expedidor').val(),
            'SenhaGestor': $('#senha').val(),
            'TelefoneGestor': $('#telefone').val(),
            'Lotacao': $('#lotacao').val(),
        },
        success: function(data){

            swal("", data.Mensagem, data.Tipo)
            console.log(data)
            if (data.Tipo == "success"){
                window.location = '/CadastrarGestores/' + data.CodigoGestor;
            }
        },error: function(data){
            console.log('erro ao cadastrar gestor');
        }
    });
}

function buscaGestor() {
    loadDiv('div-card-consulta-gestores', 'B');
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
        url: "/ListarGestores",
        data: {'NomeGestor': $("#nome").val(),
               'Matricula': $("#matricula").val(),
               'CPF': $("#cpf").val(),
               'Lotacao': $("#lotacao").val(),
               'StatusGestor': $("#status").val()
        },
        success: function(data){
            loadDiv('div-card-consulta-gestores', 'L');
            montaTabGestores(data.Relacao);
            $('#qnt_total').html(data.Relacao.length)
        },error: function(data){
            erroProcessarDados(data);
        }
    });
}

function montaTabGestores(data){
            retornaTabela({
               cabecalho:['Nome', 'Matrícula','CPF', 'RG', 'Lotação', 'Status'],
               id_table: 'consulta-gestor-tab',
               campos_data: ['NOME_COMPLETO', 'MATRICULA', 'CPF', 'RG', 'LOTACAO', 'STATUS_GESTOR'],
               dados: data,
               div_table: 'div-consulta-gestor',
               link_table: ['buscaGestorSelecionado', 'CODIGO']
        });
}

function buscaGestorSelecionado(codigo) {
    window.location = '/CadastrarGestores/' + codigo;
}

function alterarGestor() {
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
        url: "/AlterarGestores",
        data: {
            'CodigoGestor': CODIGO_GESTOR,
            'NomeGestor': $('#nome_completo').val(),
            'Matricula': $('#matricula').val(),
            'Cpf': $('#cpf').val(),
            'Rg': $('#rg').val(),
            'OrgaoExpedidor': $('#orgao_expedidor').val(),
            'SenhaGestor': $('#senha').val(),
            'TelefoneGestor': $('#telefone').val(),
            'Lotacao': $('#lotacao').val(),
            'StatusGestor': $('#status').val(),
        },
        success: function(data){
            console.log(data)
            swal("", data.Mensagem, data.Tipo)
            if (data.Tipo == "success"){
                window.location = '/ConsultarGestores';
            }
        },error: function(data){
            console.log('erro ao alterar gestor');
        }
    });

}


