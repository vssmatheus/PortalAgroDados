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



function buscaCCeDepartamento() {
    loadDiv('div-card-consulta-departamentos', 'B');
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
        url: "/ConsultaCentroDeCustoDepartamentos",
        // data: [],
        success: function(data){
            loadDiv('div-card-consulta-departamentos', 'L');
            if(data.Relacao.length == 0) {
                $("accordion-consulta-centro-de_custo_e_empenho").html('<h3 class="center">Nenhuma informação encontrada!</h3>');
                $("#accordion-consulta-centro-de_custo_e_empenho").empty();
            }else{
                retornaAccordion({
                        'dados': data.Relacao,
                        'accordion': 'accordion-consulta-centro-de_custo_e_empenho',
                        'titulo_accordion': ['DESCRICAO_CENTRO'],
                        'titulos_table_head': ['Centro de Custo', 'Departamento', 'Número Departamento'],
                        'dados_table_body': ['DESCRICAO_CENTRO', 'DEPARTAMENTO', 'NUMERO_DEPARTAMENTO'],
                        'alinhamento_table_head_body': ['center', 'center', 'center'],
                    });
            }
        },error: function(data){
           erroProcessarDados(data);
        }
    });
}

