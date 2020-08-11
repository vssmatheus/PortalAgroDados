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
    // loadDiv('div-card-consulta-usuario', 'B');
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
             // loadDiv('div-card-consulta-usuario', 'L');
            montaTabUsuPortal(false, data.Relacao);
            $('#qnt_total').html(data.Relacao.length)

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
           link_table: ['buscaUsuarioPortalSelecionado', 'CODIGO_USUARIO']
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
    /*VERIFICA CAMPOS VAZIOS*/

        // DADOS PESSOAIS
        if ($("#cpf").val() == '' ||
            $("#nome_usuario").val() == '' ||
            $("#login_usuario").val() == '' ||
            $("#email").val() == '' ||
            $("#status").val() == '' ||
            ( $("#lbl-senha").text().trim().startsWith('Senha') && $("#senha").val() == '')
        ) {
             $("#baseIcon-tab11").trigger('click');
            return true;
        }


           //VERIFICA SE O CAMPO EXISTE
    if (document.getElementById('aceita_sms')){
        var dgTelefone = $("#telefone_cel").val().match(/\d+/);
        if (dgTelefone == null){
            dgTelefone = '';
        }
        if ($("#aceita_sms").is(':checked') &&  dgTelefone.length == 0) {
            $("#baseIcon-tab13").trigger('click');
            swal("Atenção", "Caso ACEITA SMS esteja selecionado, é necessario informar um número de telefone!", "info");
            return false;
        }
    }


    return true;
}

//Departamento
function dragStart(ev){
    ev.dataTransfer.setData("ID", ev.target.getAttribute('id'));
}

function dragOver(ev){
    return false;
}

function dragDrop(acao, idDiv){
    var idElem = acao.dataTransfer.getData("ID");
    var obj = idElem.split("_");

    if(obj[0] != idDiv){

        var id = obj[1];
        var departamentoSelecionado = acao.dataTransfer.getData("ID");

        var div = document.getElementById(idDiv);
        div.appendChild(document.getElementById(departamentoSelecionado));

        if(idDiv == 'departamento-disponiveis'){
            $("#"+idElem).removeClass("right").addClass("left").attr("id",idDiv+"_"+id);
        }else{
            $("#"+idElem).removeClass("left").addClass("right").attr("id",idDiv+"_"+id);
        }

        var acao = '';
        if (idDiv == 'departamento-disponiveis'){
            acao = 'R';
        }else{
            acao = 'I';
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
            url: "/InsereDepartamento",
            data:  {"CodigoDepartamento": id,"CodigoUsuario": CODIGO_USUARIO, "Acao" : acao},
            success: function(data){
                if(idDiv == 'departamento-disponiveis'){
                    toastr.warning('Departamento Removido com sucesso!', '', {"closeButton": true});
                }else{
                    toastr.success('Departamento Inserido com sucesso!', '', {"closeButton": true});
                }

            },error: function(){
                swal("","Erro ao atualizar","warning");
            }
        });
    }
}

//EMpresas
function dragStartEmpresas(ev){
    ev.dataTransfer.setData("ID", ev.target.getAttribute('id'));
}

function dragOverEmpresas(ev) {
    return false;
}

function dragDropEmpresas(acao, idDiv) {
    var idElem = acao.dataTransfer.getData("ID");
    var obj = idElem.split("_");
    var tem_empresas = '';

    if(obj[0] != idDiv){

        var id = obj[1];
        var EmpresasSelecionada = acao.dataTransfer.getData("ID");

        var div = document.getElementById(idDiv);
        div.appendChild(document.getElementById(EmpresasSelecionada));

        if(idDiv == 'empresas-disponiveis'){
            $("#"+idElem).removeClass("right").addClass("left").attr("id",idDiv+"_"+id);
            tem_empresas = 'N';
        }else{
            $("#"+idElem).removeClass("left").addClass("right").attr("id",idDiv+"_"+id);
            tem_empresas = 'S';
        }

        var acao = '';
        if (idDiv == 'empresas-disponiveis'){
            acao = 'R';
        }else{
            acao = 'I';
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
            url: "/InsereEmpresas",
            data: {'CodigoEmpresa': id, 'CodigoUsuario' : CODIGO_USUARIO, "Acao" : acao},
            success: function(data){
                if(data.CodigoErro){
                    toastr.error(data.Mensagem, '', {"closeButton": true});
                    return;
                }
                if(parseInt(data.RowsEffect) > 0){
                    if(idDiv == 'empresas-disponiveis'){
                        toastr.warning('Acesso Empresa removido com sucesso!', '', {"closeButton": true});
                    }else{
                        toastr.success('Acesso Empresa inserido com sucesso!', '', {"closeButton": true});
                    }
                }else{
                    toastr.warning('Ocorreu um erro ao desautorizar empresa!', '', {"closeButton": true});
                }


            },error: function(){
                toastr.error('Erro ao inserir empresas!', '', {"closeButton": true});
            }
        });
    }
}

//Menus e SubMenus
function dragStartMenuSubMenu(ev) {
    ev.dataTransfer.setData("ID", ev.target.getAttribute('id'));
}

function dragOverMenuSubMenu(ev) {
    return false;
}

function dragDropMenuSubMenu(acao, idDiv) {
    var idElem = acao.dataTransfer.getData("ID");
    var obj = idElem.split("_");
    var tem_SubMenu = '';

    if(obj[0] != idDiv){

        var idMenu = obj[1];
        var idSubMenu = obj[2];
        var SubMenuSelecionada = acao.dataTransfer.getData("ID");

        var div = document.getElementById(idDiv);
        div.appendChild(document.getElementById(SubMenuSelecionada));

        if(idDiv == 'submenus-disponiveis'){
            $("#"+idElem).removeClass("right").addClass("left").attr("id",idDiv+"_"+idMenu+"_"+idSubMenu);
            tem_SubMenu = 'N';
        }else{
            $("#"+idElem).removeClass("left").addClass("right").attr("id",idDiv+"_"+idMenu+"_"+idSubMenu);
            tem_SubMenu = 'S';
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
        url: "/InsereSubMenus",
        data: {"idMenu": idMenu, "idSubMenu": idSubMenu, 'InsereMenu': tem_SubMenu, "CodigoUsuarioPortal":$("#codigo_usuario").val()},
        success: function(data){
            if(data.Codigo > 0){
                toastr.warning(data.Mensagem, '', {"closeButton": true});
                return;
            }

            if(idDiv == 'submenus-disponiveis'){
                toastr.warning('Acesso SubMenu removido com sucesso!', '', {"closeButton": true});
            }else{
                toastr.success('Acesso SubMenu inserido com sucesso!', '', {"closeButton": true});
            }

        },error: function(){
            toastr.error('Erro ao inserir menu!', '', {"closeButton": true});
        }
    });
    }
}

function dragEnd(acao){
    acao.dataTransfer.clearData("ID");
    return true;
}
