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

var D_USUARIO=[];
function pedidoNovaViaCartao(codigo) {
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
        url: "/ListarCartoes",
        data: { 'CodigoCartao': codigo},
        success: function(data){
            D_USUARIO=[];
            if (data.Cartoes[0].STATUS_USU == 'C'){
                swal("", "Para solicitar uma Nova Via é necessário que o Cartão não esteja Cancelado'", "warning");
                return;
            }else{

                $('#modalNovaViaCartao').modal('show');

                $('#lbl-nome').html(`Nome: <span style="font-weight:lighter;">${data.Cartoes[0].NOME_COMPLETO}</span>`);
                $('#lbl-nrcartao').html(`Cartão: <span style="font-weight:lighter;">${data.Cartoes[0].CARTAO}</span>`);

                $('#lbl-matricula').html(`Matrícula: <span style="font-weight:lighter;">${data.Cartoes[0].MATRICULA}</span>`);
                $('#lbl-departamento').html(`Departamento: <span style="font-weight:lighter;">${data.Cartoes[0].DEPARTAMENTO}</span>`);


                $('#lbl-status').html(`Status: <span style="font-weight:lighter;">${data.Cartoes[0].DESCRICAO_STATUS}</span>`)
                $('#lbl-via-atual').html(`Via: <span style="font-weight:lighter;">${data.Cartoes[0].NUMERO_VIA}</span>`);
                // $('#slc-motivo').html(`Motivo: <span style="font-weight:lighter;" >
                //   <select class="selectpicker" id="motivo" required> <option selected disabled value="">SELECTIONE UM MOTIVO</option> <option value="0">PERDA/ROUBO/EXTRAVIO</option> <option value="1">OUTROS MOTIVOS</option> </select>     </span>`);




                $('#btn-solicitar-via').removeClass("disabled");

                D_USUARIO=data.Cartoes[0];
            }


        },error: function(data){
            console.log('erro.pedidoNovaViaCartao')
        }
    });
}

function solicitarNovaViaCartao() {

    if ($("#motivo-seg-via").val() == null){
        swal("ATENÇÃO", "SELECIONE UM MOTIVO DE SEGUNDA VIA", "warning");
        return;
    }


    mensagemAlerta = "Confirmar o pedido de NOVA VIA para " + D_USUARIO.NOME_COMPLETO + " e matrícula: " + D_USUARIO.MATRICULA + "?";
     swal({
        title: "",
        text: mensagemAlerta,
        type:"info",
        confirmButtonClass: "btn-danger",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        dangerMode : true
     },
     function(isConfirm){
        if (isConfirm){
            postSegVia();
        }
     });
}

function postSegVia( ){
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
        url: "/PedidoSegundaVia",
        data: { 'NumeroCartao': D_USUARIO.CARTAO_USUARIO,
                'CodigoMotivo' : $("#motivo-seg-via").val()
        },
        success: function(data){
         swal({
                title: "",
                text: data.Retorno.Mensagem,
                type:"info"
       },function(isConfirm){
            if (isConfirm){
                D_USUARIO = [];
                $('#btn-solicitar-via').addClass("disabled");
                $('#modalNovaViaCartao').modal('hide');
                D_USUARIO=[];
                // lembrar de fechar o modal para o cliente nao clicar varias vezes em solicitar e zerar variavel D_USUARIO
            }
        });
        },error: function(data){
            console.log('erro.postSegVia')
        }
    });

}
