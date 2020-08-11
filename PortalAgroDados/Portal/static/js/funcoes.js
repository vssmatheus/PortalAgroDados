var SPINNER = '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> ';
var habilitarAbas = 0; //habilitar todos os campos var habilitarAbas 0 = on | 1 = off
var stepInicial = 0;   //index de inicialização var stepInicial


/*Antigo load do migue*/
function loadDiv(id,tipo){
    // var block_ele = $("#"+id).closest('.card');
    var block_ele = $.fn.blockUI("#"+id).closest('.card');
    if(tipo == "B"){

        block_ele.block({
            message: '<div class="ft-refresh-cw icon-spin font-medium-2"></div>',
            //timeout: 3000, //unblock after 2 seconds
            overlayCSS: {
                backgroundColor: '#FFF',
                cursor: 'wait',
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none'
            }
        });

    }else{
        block_ele.unblock();
    }
}

/*Load dentro do botão*/
function loadButton(id,texto,tipo){
    if(tipo == "B"){
        $("#"+id).html(SPINNER);
        $("#"+id).attr("disabled", true);
    }else{
        $("#"+id).html(texto);
        $("#"+id).removeAttr("disabled");
    }
}

/*Script jQuery para esconder a logo quando o scroll passar do menu */
$(window).scroll(function(){
    if($(document).scrollTop() > 56){// 56px
        $('#center-logo').fadeOut();
    } else {
        $('#center-logo').fadeIn();
    }
});

/* Calendario antigo - substituiu pela mascara
$( function() {
    $( ".date" ).datepicker({language: "pt-BR"});
});
*/

/* Formata campo para float */
function formatReal( int ) {
    var tmp = int+'';
    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
    if( tmp.length > 6 )
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    return tmp;
}

/*Formata campo para float também, o proximo que for utilizar ver qual função é melhor e apagar a outra sem medo*/
$(".number_to_real").on("keyup", function(){
    var vlr = $("#"+this.id).val();
    var rs = vlr.replace(",","").replace(".","");
    $("#"+this.id).val(formatReal(rs));

});

/* Abre modal para relatorio*/
function abreModalRelatorio(titulo,link, relatorio=true){

     $("#tituloRelatorio").html(titulo);

    if(relatorio){
        $("#linkFrameRelatorio").html(`<iframe class="frame center" src="`+link+`"></iframe>`);
    }else{
        $("#linkFrameRelatorio").html(`<iframe class="frame" src="data:application/pdf;base64,`+link+`"></iframe>`);
    }

    $("#modalRelatorios").modal();

}

/*Replace*/
String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
    return this.split(needle).join(replacement);
};

/*Lpad*/
String.prototype.lpad = String.prototype.lpad || function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

/*Formata valores*/
function numberToReal(numero) {

    if(isNaN(parseInt(numero))){
        return 'R$ 0,00';
    }
    numero = parseFloat(numero);
    numero = numero.toFixed(2).split('.');
    numero[0] = 'R$ '+ numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}

/*Mascaras*/
$('.validaCpf').on('keyup',function () {
    var cpf = $("#cpf").val();
    cpf = cpf.replace(/\D/g, '');
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9,10].forEach(function(j){
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
            soma += parseInt(e) * ((j+2)-(i+1));
        });
        r = soma % 11;
        r = (r <2)?0:11-r;
        if(r != cpf.substring(j, j+1)) result = false;
    });
    if(!result) {
        $("#lb_msg").removeClass('hide');
        $("#lb_msg").html('<strong class="danger">Cpf Inválido</strong>');
        return;
    }else{
        $("#lb_msg").addClass('hide');
    }
});

$(document).ready(function(){
    $('.maskCpf').mask('000.000.000-00', {reverse: true});
    $('.maskPlaca').mask('SSS-0A00'); //S = Somente letra, A = letra ou numero
    $('.maskTel').mask('(99)9999-99999');
    $('.maskSomenteNumero').mask('#');
    $('.real').mask("#.##0,00", {reverse: true});
    $('.float').mask("#.00", {reverse: true});
    $(".cep"). mask("99999-999", {reverse: true});
    $(".date"). mask("99/99/9999 ", {reverse: true});

    validar_hora = {
        onComplete: function(data, e) {
            erro = 0
            msg_hora = ``
            if(data.split(':')[0] < 0 || data.split(':')[0] > 23){
                erro = -1
                msg_hora += "Hora inválida<br>"
            }

            if(data.split(':')[1] < 0 || data.split(':')[1] > 59){
                erro = -1
                msg_hora += "Minuto inválido"
            }

            if(erro < 0){
                toastr.warning(msg_hora, data, {'timeOut':5500 } ) //5seg
                $('#'+e.target.id).val('')
            }

        },
        placeholder: "00:00",
        reverse: true
    }

    $('.maskHora').mask('00:00', validar_hora);
    $('.maskHora').blur(function() {
        if($('.maskHora').val().length < 5){
            toastr.warning('Hora inválida',$('.maskHora').val(), {'timeOut':5500 } )
            $('.maskHora').val('')
        }


    });

    validar_data = {
        onComplete: function(data, e) {
            erro = 0
            msg_data = ``
            if(data.split('/')[0] < 1 || data.split('/')[0] > 31){
                erro = -1
                msg_data += 'Dia do mês inválido<br>'
            }

            if(data.split('/')[1] < 1 || data.split('/')[1] > 12){
                erro = -1
                msg_data += 'Mês do ano inválido'
            }

            if(erro < 0){
                toastr.warning(msg_data, data, {'timeOut':5500 } )
                $('#'+e.target.id).val('')
            }

        },
        placeholder: "__/__/____"
    }
    $(".date").mask('00/00/0000', validar_data);
    $('.date').blur(function(e) {
        if($('#'+e.target.id).val().length == 0){
            return
        }
        if($('#'+e.target.id).val().length < 10){
            toastr.warning('Data inválida',$('.date').val(), {'timeOut':5500 } )
            $('#'+e.target.id).val('')
        }
    })

});

/* colocando as classes abaixo no html, os inputs sao preenchidos automaticos com o primeiro e ultimo dia do mes corrente*/
$(document).ready(function(){
    var data    = new Date();
    var _data 	= ``
    var _data_futura 	= ``
    var primeiroDia = new Date(data.getFullYear(), data.getMonth(), 1).getDate();
    var ultimoDia = new Date(data.getFullYear(), data.getMonth() +1, 0).getDate();
    var mes_corrent = new Date(data.getFullYear(), data.getMonth()+1, 1).getMonth();
    var proximo_mes = new Date(data.getFullYear(), data.getMonth()+2, 1).getMonth();

   /* if(String(mes_corrent).length < 2){
        _data = '/0'+mes_corrent+'/'+data.getFullYear()
    }else{
        _data = '/'+mes_corrent+'/'+data.getFullYear()
    }*/

    if(String(mes_corrent).length < 2){
        if(String(mes_corrent) == '0'){
            _data = '/'+'12'+'/'+data.getFullYear()
        }else if(String(mes_corrent) == '1'){
            ano = data.getFullYear()+1
             _data = '/0'+mes_corrent+'/'+ano
        }
        else{
            _data = '/0'+mes_corrent+'/'+data.getFullYear()
        }
    }else{
        _data = '/'+mes_corrent+'/'+data.getFullYear()
    }

    if(String(proximo_mes).length < 2){
        if(String(proximo_mes) == '0'){
            _data_futura = '/'+'12'+'/'+data.getFullYear()
        }else if(String(proximo_mes) == '1'){
            ano = data.getFullYear()+1
             _data_futura = '/0'+proximo_mes+'/'+ano
        }
        else{
            _data_futura = '/0'+proximo_mes+'/'+data.getFullYear()
        }
    }else{
        _data_futura = '/'+proximo_mes+'/'+data.getFullYear()
    }

    if(String(primeiroDia).length < 2){
        primeiroDia = '0'+primeiroDia+_data
    }else{
        primeiroDia = primeiroDia+_data
    }

    if(String(ultimoDia).length < 2){
        ultimoDia = '0'+ultimoDia+_data
    }else{
        ultimoDia = ultimoDia+_data
    }

    $(".primeiro_dia_mes").val(primeiroDia)
    $(".ultimo_dia_mes").val(ultimoDia)
    $(".proximo_mes").val('01'+_data_futura)
})

function scrollTo(id){
    $('html, body').animate({
        scrollTop: $("#"+id).offset().top
    }, 500);
}

function somenteNumeros(num) {
    var er = /[^0-9.,]/;
    var campo = num;
    if (er.test(campo.value)) {
        campo.value = "";
    }

}

//verifica se o acordion já existe e não deixa criar outro duplicado
function verificaAcordionDuplicado(arr, procurar) {
    var chave = procurar[0];
    var valor = procurar[1];
    return !!arr.filter(function (el) {
        return el[chave] == valor;
    }).length;
}

/*retira o none da tabela*/
function retiraNoneDaTable(numero) {
    if (numero == null){
        return ' ';
    }else{
         return numero;
     }
}

function removeCaracteresEspeciais(palavra) {
    //const str = 'ÁÉÍÓÚáéíóúâêîôûàèìòùÇç/.,~!@#$%&_-12345';
    const parsed = palavra.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
    return parsed
}

function verificaAcordionDuplicado(arr, procurar) {
    var chave = procurar[0];
    var valor = procurar[1];
    return !!arr.filter(function (el) {
        return el[chave] == valor;
    }).length;
}

function retornaAccordion(param) {
    $(`#${param['accordion']}`).empty();
    qtd_accordion = param['titulo_accordion'].length
    posicao_vetor_titulo_accordion = 1
    lista_id_accordion = []
    accordion_da_vez = ``
    id_accordion_tem_cabecalho = []
    if (typeof(param['alinhamento_table_head_body']) =="undefined"){
        param['alinhamento_table_head_body'] = []
        for(i = 0; i< param['dados_table_body'].length; i++){
            param['alinhamento_table_head_body'][i] = 'left'
        }
    }

    for(var id_linha_accordion_data in param['dados']){
        id_accordion = ``
        for(var id_posicao_titulo_accordion in param['titulo_accordion']){

            if(id_posicao_titulo_accordion > 0){
                id_accordion_anterior = id_accordion
                id_accordion += String(param['titulo_accordion'][id_posicao_titulo_accordion])+'_'+removeCaracteresEspeciais(String(param['dados'][id_linha_accordion_data][param['titulo_accordion'][id_posicao_titulo_accordion]]))
                html_acordion_header = `<div id="heading${id_accordion}" class="card-header " style="border: 1px solid #a1a361;background: rgba(191,195,107,0.58);font-size:11px;">
                                           <a data-toggle="collapse" data-parent="#accordionWrap2" href="#accordion${id_accordion}" aria-expanded="false" aria-controls="accordion${id_accordion}" class="card-title lead collapsed"></a>`;
                html_acordion_body = `</div>
                                        <div id="accordion${id_accordion}" role="tabpanel" aria-labelledby="heading${id_accordion}" class="card-block collapse" aria-expanded="false" style="padding: 4.3px;font-size:11px;"></div> `;

                if (!verificaAcordionDuplicado(lista_id_accordion, ['data', id_accordion])) {
                    var x = id_posicao_titulo_accordion -1
                    $(`#accordion${id_accordion_anterior}`).append(html_acordion_header + param['dados'][id_linha_accordion_data][param['titulo_accordion'][id_posicao_titulo_accordion]]+ html_acordion_body);
                }
                lista_id_accordion.push({'data':id_accordion})
            }else{

                id_accordion = param['titulo_accordion'][id_posicao_titulo_accordion]+'_'+removeCaracteresEspeciais(String(param['dados'][id_linha_accordion_data][param['titulo_accordion'][id_posicao_titulo_accordion]]))

                html_acordion_header = `<div id="heading${id_accordion}" class="card-header" style="border: 1px solid #a1a361;background: rgba(191,195,107,0.58);font-size:11px;">
                                           <a data-toggle="collapse" data-parent="#accordionWrap2" href="#accordion${id_accordion}" aria-expanded="false" aria-controls="accordion${id_accordion}" class="card-title lead collapsed"></a>`;
                html_acordion_body = `</div>
                                        <div id="accordion${id_accordion}" role="tabpanel" aria-labelledby="heading${id_accordion}" class="card-block collapse" aria-expanded="false" style="padding: 4.3px"></div> `;

                if (!verificaAcordionDuplicado(lista_id_accordion, ['data', id_accordion])) {

                     $(`#${param['accordion']}`).append(html_acordion_header + param['dados'][id_linha_accordion_data][param['titulo_accordion'][id_posicao_titulo_accordion]] + html_acordion_body);

                }
                lista_id_accordion.push({'data':id_accordion})
            }
        }

        if(!verificaAcordionDuplicado(id_accordion_tem_cabecalho, ['data', id_accordion])){
            cabecalho_table_accordion = `<div class="table-responsive" style="background: #fff;padding: 0px;max-height:350px;">
                                    <table class="table table-bordered table-hover table-striped table-font-screen table-click "  id="dataTableRetornaAccordion${id_accordion}" style="margin-bottom: 0px;background: #fff;font-size:11px;" >
                                        <thead>
                                            <tr>`
            cabecalho = ``

            for(indice_cabecalho in param['titulos_table_head']){
                cabecalho += `<th style="text-align:${param['alinhamento_table_head_body'][indice_cabecalho]}">${param['titulos_table_head'][indice_cabecalho]}</th>`
            }

            $(`#accordion${id_accordion}`).append(cabecalho_table_accordion + cabecalho + `</tr></thead><tbody id="tbody-${id_accordion}"></tbody></table></div>`)
        }
        if (typeof(param['link_table']) !="undefined"){

            if(param['link_table'].length < 2){
                linha = `<tr onclick='${param['link_table'][0]}(${JSON.stringify(param['dados'][id_linha_accordion_data])})'>`
            }else{
                linha = `<tr onclick="${param['link_table'][0]}(`
                for(j = 1; j < param['link_table'].length; j++){
                    linha +=  `'${param['dados'][id_linha_accordion_data][param['link_table'][j]]}',`
                }
                linha = linha.substring(0,linha.length-1)+`)">`
            }
        }else{
            linha = `<tr style="font-size: 10px;">`
        }

        for(indice_linha in param['dados_table_body']){
            linha += `<td style="text-align:${param['alinhamento_table_head_body'][indice_linha]}">${retiraNoneDaTable(param['dados'][id_linha_accordion_data][param['dados_table_body'][indice_linha]])}</td>`
        }

        $(`#tbody-${id_accordion}`).append(linha+`</tr>`)
        id_accordion_tem_cabecalho.push({'data':id_accordion})

            // $('#ordenaNomeCartao').trigger('click')
    }
    for( i in id_accordion_tem_cabecalho){
        if ($.fn.dataTable.isDataTable('#dataTableRetornaAccordion'+ id_accordion_tem_cabecalho[i]['data'])) {
            table = $('#dataTableRetornaAccordion'+ id_accordion_tem_cabecalho[i]['data']).DataTable();
        }
        else {
            table = $('#dataTableRetornaAccordion'+ id_accordion_tem_cabecalho[i]['data']).DataTable({
                paging: false,
                searching: false,
                language: {decimal: ","}
            });
        }
    }

}

function mascaraValor(valor) {
    valor = valor.toString().replace(/\D/g,"");
    valor = valor.toString().replace(/(\d)(\d{8})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{5})$/,"$1.$2");
    valor = valor.toString().replace(/(\d)(\d{2})$/,"$1,$2");

    return valor
}

$(document).ready(function(){
/*permite ordernar data em tables*/
    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
	"date-eu-pre": function ( date ) {
		date = date.replace(" ", "");

		if ( ! date ) {
			return 0;
		}

		var year;
		var eu_date = date.split(/[\.\-\/\:]/);

		/*seg (opcional)*/
        if ( eu_date[4] ) {
			seg = eu_date[4];
		}
		else {
			seg = 0;
		}

		/*min (opcional)*/
        if ( eu_date[3] ) {
			min = eu_date[3];
		}
		else {
			min = 0;
		}

		/*year (optional)*/
		if ( eu_date[2] ) {
			year = eu_date[2];
			if(year.length > 4){
			    year = year.substring(0,year.length - 2)
                hora = year.substring(year.length,2)
            }else{
			    hora = 0
            }

		}
		else {
			year = 0;
		}

		/*month*/
		var month = eu_date[1];
		if ( month.length == 1 ) {
			month = 0+month;
		}

		/*day*/
		var day = eu_date[0];
		if ( day.length == 1 ) {
			day = 0+day;
		}

		return (year + month + day  + hora +min + seg) * 1;
	},

	"date-eu-asc": function ( a, b ) {
		return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	},

	"date-eu-desc": function ( a, b ) {
		return ((a < b) ? 1 : ((a > b) ? -1 : 0));
	}
} );
});

function validaDatasRelatorios(dt_inicial, dt_final, validaInicialFuturo = false){
    var inicial = moment($("#"+dt_inicial).val(), "DD/MM/YYYY").toDate();
    var final = moment($("#"+dt_final).val(), "DD/MM/YYYY").toDate();

    var hoje = moment().format("DD/MM/YYYY").toString();

      if (isNaN(inicial.getDate())) {
        swal("", "Data Inicial não informada.", "warning");
        return false;
      }


      if(validaInicialFuturo && (  inicial > moment( hoje, "DD/MM/YYYY").toDate()  ) ){
          swal("", "Data Inicial não pode ser superior a Data de Hoje.", "warning");
          return false;
      }


      if (isNaN(final.getDate())) {
            $("#"+dt_final).val( hoje);
            final =  moment($("#"+dt_final).val(), "DD/MM/YYYY").toDate();
      }


      if(inicial > final){
        swal("", "Data Inicial não pode ser superior a Data Final.", "warning");
        return false;
    }
    return true;
}

function retornaTabela(dados) {
    head_table = `<form id="${dados.id_table}">
                 <table class="table table-striped table-hover table-click table-bordered" id="dataTable${dados.id_table}" style="font-size:13px">
                     <thead>
                     <tr style="text-align:center;font-size:11px;">`
    th = ``
    middle_table = `</tr>
             </thead>
             <tbody id="grid-${dados.id_table}">`

    for(i = 0; i < dados.cabecalho.length; i++){
        th += `<th class="center">${dados.cabecalho[i]}</th>`
    }

    table = head_table + th + middle_table

    htmlDados = ``
    for(var i in dados.dados) {
        if (typeof(dados['link_table']) !="undefined"){

            if(dados['link_table'].length < 2){
                linha = `<tr style="text-align:center;font-size:11px;" onclick='${dados['link_table'][0]}(${JSON.stringify(dados['dados'][i])})'>`
            }else{
                linha = `<tr onclick="${dados['link_table'][0]}(`
                for(x = 1; x < dados['link_table'].length; x++){
                    linha +=  `'${dados['dados'][i][dados['link_table'][x]]}',`
                }
                linha = linha.substring(0,linha.length-1)+`)">`
            }
        }else{
            linha = `<tr style="text-align:center;font-size:11px;">`
        }

        htmlDados += linha

        for (j = 0; j < dados.campos_data.length; j++) {
            htmlDados += `<td style="text-align:center">${retiraNoneDaTable(dados.dados[i][dados.campos_data[j]])}</td>`
        }
        htmlDados += `</tr>`
    }
    $(`#${dados.div_table}`).html(table+htmlDados)


    var orderby = [];
    if (dados['order_table'] && dados.dados.length > 0) {
        for (var i = 0; i < dados['order_table'].length; i++) {
            orderby.push([Math.abs(dados.campos_data.indexOf(dados['order_table'][i][0])), dados['order_table'][i][1].toLowerCase()]);
        }
    } else {
        orderby.push([1, "asc"]);
    }


    if ($.fn.dataTable.isDataTable(`#dataTable${dados.id_table}`)) {
        table = $(`#dataTable${dados.id_table}`).DataTable();
    }
    else {
        // if(typeof(dados['ordem_colunas'] != "undefined")){
        table = $(`#dataTable${dados.id_table}`).DataTable({
            paging: true,
            language: {decimal: ","},
            order: orderby,
            drawCallback: function( settings ) {
                if (dados['fn_init_table'] != undefined){
                    dados['fn_init_table'].call();
                }
            }
        });
        // }else{
        //     table = $(`#dataTable${dados.id_table}`).DataTable({
        //     paging: true,
        //     language: {decimal: ","},
        //     drawCallback: function( settings ) {
        //         if (dados['fn_init_table'] != undefined){
        //            dados['fn_init_table'].call();
        //         }
        //     },"order": orderby
        // });
        // }
    }

    // $('#ordenaNomeCartao').trigger('click')
}

function reloadAfterSwal(tipo, mensagem, href = ''){

    swal({
        title: "",
        text: mensagem,
        type: tipo,
        showCancelButton: false,
        allowEscapeKey : false, //desabilita o ESC
        confirmButtonText: "OK"
    }, function(isConfirm){
        //if (isConfirm) {
            if (href != '') {
                window.location = href;
            } else {
                if (tipo == "success") {
                    location.reload();
                }
            }
        //}
    });
}

function saveInputSessionStorage( divHtml=''){
    let inputValues = {};

    if (divHtml != ''){
        inputValues['idSavedHtml'] = divHtml;
        inputValues['savedHtml'] = $("#"+divHtml)[0].outerHTML;
     }
        $('input').each(function () {
            /* NAO GRAVAR csrfmiddlewaretoken e csrftoken */
            if (!($(this).attr('name').toUpperCase().includes('CSRF') && $(this).attr('name').toUpperCase().includes('TOKEN'))) {
                inputValues[$(this).attr('name')] = $(this).val();
            }
        });

        $('select').each(function () {
            inputValues[$(this).attr('name')] = $(this).val();
        });

    sessionStorage.setItem(window.location.href, JSON.stringify(inputValues));
}

function restoreInputLocalStorage(hrefClickButton=''){
    if (sessionStorage.getItem(window.location.href)) {
       let restoredSession = JSON.parse(sessionStorage.getItem(window.location.href));

       if (restoredSession['idSavedHtml']){
           $( "#"+restoredSession['idSavedHtml'] ).replaceWith(restoredSession['savedHtml']);
       }

       for (let i in restoredSession) {
           $("#" + i).val(restoredSession[i]);
       }
        if (hrefClickButton !=''){
            $('#'+hrefClickButton).trigger('click');
        }
    }
}

function erroProcessarDados(id_div = ''){
    // let msg = (erro.responseText.split(" ").join("").split('ExceptionType')[0]).split ('line');
    // let len = msg.length-1;
    // msg = msg[len];
    // msg = msg.split(',in');
    // msg = msg[1].split('\n')[0] + " -> "+msg[0];
    //
    // swal("", "Erro ao processar a solicitação! Entre em contato com a Vólus!\n"+msg, "error");
    swal("", "Erro ao processar a solicitação! Entre em contato com a Vólus!", "error");
    let divLoad = ''
    if (id_div != ''){
        divLoad = id_div
    }else{
        divLoad = $(".card-block").attr("id");
    }

    loadDiv(divLoad, 'L')
}