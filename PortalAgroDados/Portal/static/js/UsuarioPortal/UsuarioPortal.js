var CODIGO_USUARIO = 0;
var CABECALHO_TABELA = [];
var CAMPOS_TABELA = [];

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
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

//**************Consultar Usuário portal
function buscaUsuarioPortal() {
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
        url: "/ListarUsuarioPortal",
        data: {'LoginUsuario': $("#login").val(),
               'NomeUsuario': $("#nome_usuario").val(),
               'StatusUsuario': $("#status").val()
        },
        success: function(data){
            montaTabUsuPortal(false, data.Relacao);
        },error: function(data){
            erroProcessarDados(data);
        }
    });
}

function montaTabUsuPortal(tabelaVazia=false, data){

    var dados = [];
    if (!tabelaVazia){
        dados = data;
    }

    retornaTabela({
           cabecalho:CABECALHO_TABELA,
           id_table: "div-consulta-usuarios-tab",
           campos_data: CAMPOS_TABELA,
           dados: dados,
           div_table: "div-consulta-usuarios",
           link_table: ['buscaUsuarioPortalSelecionado', 'CODIGO']
    });
}

function buscaUsuarioPortalSelecionado(codigo) {
    window.location = '/CadastroUsuarioPortal/' + codigo;
}

//**************Cadastrar Usuário portal
// faz a validação se o valor digitr é um email(para que o  usuario nao digite qualquer coisa)
function checarEmail() {
    if( document.forms[0].email.value=="" || document.forms[0].email.value.indexOf('@')==-1 || document.forms[0].email.value.indexOf('.')== -1 ){
        swal("Email Inválido", "", "info");
    }
}

function validacoesAcesso() {

    if ($("#cpf").val() == '' ||
        $("#nome_usuario").val() == '' ||
        $("#login").val() == '' ||
        $("#email").val() == '' ||
        $("#status").val() == '' ||
        ($("#lbl-senha").text().trim().startsWith('Senha') && $("#senha").val() == '')
    ) {
        $("#baseIcon-tab11").trigger('click');
        return false;
    }
}

function cadastrarUsuario() {
    validacoesAcesso();

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
        url: "/InsereUsuario",
        data: {
            'NomeUsuario': $('#nome_completo').val(),
            'EmailUsuario': $('#email').val(),
            'LoginUsuario': $('#login').val(),
            'SenhaUsuario': $('#senha').val(),
            'Cpf': $('#cpf').val(),
            'Matricula': $('#matricula').val(),
            'Alterar': $('#direito_alterar').val(),
            'Excluir': $('#direito_excluir').val(),
            'Grafico': $('#direito_grafico').val(),
            'Incluir': $('#direito_incluir').val(),
            'Visualizar': $('#direito_visu_login').val(),
        },
        success: function(data){
            console.log('kfdkgk')

            swal("", data.Mensagem, data.TipoRetorno)
            if (data.TipoRetorno == "success"){
                window.location = '/CadastroUsuarioPortal/' + data.CodigoUsuario;
            }
        },error: function(data){
            console.log('Error')
        }
    });
}