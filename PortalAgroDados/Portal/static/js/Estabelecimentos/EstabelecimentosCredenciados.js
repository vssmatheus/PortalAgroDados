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

function onchangeUf() {
    altera_cidade_por_uf("estados", "cidades" );
}

function buscaEstabelecimentos () {
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
                   "NomeConveniada": $("#estabelecimento").val()
            },

            success: function(data){
                loadDiv('div-card-consulta-estabelecimento', 'L');
                $("#accordion-estabelecimento-credenciados").empty();
                if(data.Relacao.length == 0) {
                    $("#accordion-estabelecimento-credenciados").html('<h3 class="center">Nenhuma informação encontrada!</h3>');
                }else{
                    retornaAccordion({
                            'dados': data.Relacao,
                            'accordion': 'accordion-estabelecimento-credenciados',
                            'titulo_accordion': ['CIDADE'],
                            'titulos_table_head': ['Estabelecimento', 'Nome Fantasia','CNPJ', 'Telefone', 'Endereço', 'Bairro', 'Cidade', 'UF', 'Atividade'],
                            'dados_table_body': ['RAZAO_SOCIAL', 'NOME_CONVENIADA', 'CNPJ','TELEFONE', 'ENDERECO', 'BAIRRO', 'CIDADE', 'ESTADO', 'ATIVIDADE'],
                            'alinhamento_table_head_body': ['left', 'left', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
                        });
                }
                $('#qnt_total').html(data.Relacao.length)
            },error: function(data){
                erroProcessarDados(data);
            }
        });
}
