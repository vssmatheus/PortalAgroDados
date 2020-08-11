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

 function montaTabCartoes(data){

            retornaTabela({
                    cabecalho:['Cartão', 'Nome Completo','Matrícula', 'Departamento', 'Status', 'Limite Crédito', 'Saldo Atual'],
                    id_table: var_id_table,
                    campos_data: ['CARTAO', 'NOME_COMPLETO', 'MATRICULA', 'DEPARTAMENTO', 'DESCRICAO_STATUS', 'LIMITE', 'SALDO_ATUAL'],
                    dados: data,
                    div_table: 'div-consulta-lista-cartao',
                    link_table: var_link_table
            });
}


function buscarCartoes () {
    loadDiv('div-card-consulta-lista-cartao', 'B');
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
        url: '/ListarCartoes',
        data: {
            'Departamento' : $("#departamentos").val(),
            'NomeCartao': $("#nome_cartao").val(),
            'Matricula':$("#matricula").val(),
            'Status': $("#status").val()
        },

        success: function(data){
            loadDiv('div-card-consulta-lista-cartao', 'L');
            montaTabCartoes(data.Cartoes);
            $('#total_cartoes').html(data.Cartoes.length)
        },error: function(data){
            erroProcessarDados(data);
        }
    });
}



function consultarDadosCartao (codigoCartao=0) {
    window.open('/ConsultarDadosCartao/'+codigoCartao,'_parent')
}
