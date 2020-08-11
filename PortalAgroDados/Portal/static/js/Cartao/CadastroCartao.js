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

function buscaEndereco () {
    var cep = $("#cep").val().replace('-','');
    if (cep.length != 8){
        swal("", "Atenção! Informe um CEP válido", "error");
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
        url: '/BuscaCep',
        data: {  'CEP' : cep  },

        success: function(data){
            if ( data.Cidade.erro ){
                swal("", "CEP não localizado", "info");
            }else{
                $("#estado").val(data.Cidade.uf);
                altera_cidade_por_uf('estado', 'cidade', true)
                $("#logradouro").val(data.Cidade.logradouro);
                $("#bairro").val(data.Cidade.bairro);
                $("#complemento").val(data.Cidade.complemento);
                $("#numero_casa").val('');

                setTimeout(function(){
                  $("#cidade").val(data.Cidade.localidade.toUpperCase());
                }, 500);



            }




        },error: function(data){
            swal("", "Erro ao busacar CEP", "error");
            console.log('erro.buscaEndereco');
        }
    });
}

function verificaCamposVazios(){

    if ($("#nome_cartao").val() == '' ||  $("#departamento").val() == '' ||  $("#limite_credito").val() == '' )  {
        $("#frmCadCartao-t-0").trigger('click');
    }else
        if ($("#bairro").val() == '' || $("#cep").val() == '' || $("#estado").val() == ''
            || $("#cidade").val() == '' || $("#logradouro").val() == '') {
            $("#frmCadCartao-t-1").trigger('click');

        }
}