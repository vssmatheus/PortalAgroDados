var CODIGO_DEPARTAMENTO = 0;

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

function limpaCampo() {
    $('#cd_descricao_centro_custo').val(''),
    $('#cd_descricao').val(''),
    $('#cc_descricao').val(''),
    $('#cd_numero_departamento').val('')
}

function cadastrarCentroCusto() {
    if ($("#cc_descricao").val() == ''){
        swal("","Por favor, preencher o campo Centro de Custo para validar o Cadastros","warning");
        return false;
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
        url: "/RegistrarCentroCusto",
        data: {
            'CentroCusto': $('#cc_descricao').val()
        },
        success: function(data){
            swal("", data.Mensagem, data.Tipo)
            limpaCampo();
        },error: function(data){
            console.log('erro ao cadastrar centro de custo');
            limpaCampo();
        }
    });
}

function cadastrarDepartamento() {
    if ($("#cd_descricao_centro_custo").val() == ''){
        swal("","Por favor, selecione  um Centro de Custo para validar o Cadastros","warning");
        return false;
    }
    if ($("#cd_descricao").val() == ''){
        swal("","Por favor, preencher o campo Departamento para validar o Cadastros","warning");
        return false;
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
        url: "/RegistrarDepartamento",
        data: {
            'CentroCusto': $('#cd_descricao_centro_custo').val(),
            'NomeDepartamento': $('#cd_descricao').val(),
            'NumeroDepartamento': $('#cd_numero_departamento').val(),
        },
        success: function(data){
            limpaCampo();
            swal({
                title: "",
                text: data.Mensagem,
                type: data.Tipo,
                confirmButtonClass: "btn-danger",
                closeOnConfirm: false
            }, function(isConfirm){
                if (isConfirm){
                    if (data.Tipo == "success"){
                        var mensagemAlerta = "Deseja inserir ao login: "+data.Login+" permissão de acesso para o novo Departamento:" + $('#cd_descricao').val();
                        swal({
                        title: "",
                        text: mensagemAlerta,
                        type:"info",
                        confirmButtonClass: "btn-danger",
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        cancelButtonText: "Não",
                        dangerMode : true
                        },function(isConfirm){
                            if (isConfirm){ atribuir_departamento_usuario(data.CodigoDepartamento);}
                        });
                    }
                }
            });
            limpaCampo();
        },error: function(data){
            console.log('erro ao cadastrar centro de custo');
            limpaCampo();
        }
    });
}

function buscaCCeDepartamento () {
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
            url: "/ConsultarDepartamentoPorCentroCusto",
            data: {"CentroCusto":$("#cd_descricao_centro_custo").val(),
                   "DescricaoDepartamento":$("#cd_descricao").val()},

            success: function(data){
                loadDiv('div-card-consulta-departamentos', 'A');

                if(data.Relacao.length == 0) {
                    $("accordion-consulta-departamento").html('<h3 class="center">Nenhuma informação encontrada!</h3>');
                    $("#accordion-consulta-departamento").empty();
                }else{
                    retornaAccordion({
                            'dados': data.Relacao,
                            'accordion': 'accordion-consulta-departamento',
                            'titulo_accordion': ['DESCRICAO_CENTRO_CUSTO'],
                            'titulos_table_head': ['Centro de Custo', 'Departamento', 'Número Departamento'],
                            'dados_table_body': ['DESCRICAO_CENTRO_CUSTO', 'DESCRICAO_DEPARTAMENTO', 'NUMERO_DEPARTAMENTO'],
                            'alinhamento_table_head_body': ['center', 'center', 'center'],
                            'link_table':['buscaDepartamentoSelecionado', 'CODIGO']

                        });
                }
            },error: function(data){
                console.log('erro.buscaCCeDepartamento');
            }
        });
}

function atribuir_departamento_usuario(codigoDepartamento) {
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
        url: "/InsereDepartamento",
        data: {"idDepartamento": codigoDepartamento },
        success: function(data){

            if (data[0].CodRetorno == "00") {
                swal("","Departamento inserido com sucesso","success")
            }else{
                swal("","Erro ao inserir Departamento","error")
            }
        },error: function(){
            swal("","Erro ao atualizar","warning");
        }
    });
}

function buscaDepartamentoSelecionado(codigo) {
    window.location = '/RegistrarDepartamento/' + codigo;
}

function alterarDepartamento() {
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
        url: "/AlterarDepartamento",
        data: {
            'CodigoDepartamento' : CODIGO_DEPARTAMENTO,
            'NumeroDepartamento': $('#cd_numero_departamento').val(),
            'DescricaoDepartamento': $('#cd_descricao').val(),
            'CodigoCentroCusto': $('#cd_descricao_centro_custo').val()
        },
        success: function(data){
            console.log(data)
            swal("", data.Mensagem, data.Tipo)
            if (data.Tipo == "success"){
                window.location = '/ConsultaListaDepartamentos';
            }
        },error: function(data){
            console.log('erro ao alterar Departamento');
        }
    });

}
