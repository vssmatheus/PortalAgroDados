var ORCAMENTOS=[];

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


function orcamentoObj(codigoOrcamento){
        return { 'CodigoOrcamento' : codigoOrcamento,
            'LI' : "tab-li-orc-"+codigoOrcamento,
            'TAB' : "tab-consulta-orc-"+codigoOrcamento,
            'FRAME' : "frame-orc-"+codigoOrcamento
        };
}


// function manipulaListaOrcamentos (acao, obj){
//     let retorno = false;
//
//     if (sessionStorage.getItem('lista-orcamentos-consulta')){
//         ORCAMENTOS = JSON.parse(sessionStorage.getItem('lista-orcamentos-consulta'))
//     }else{
//         ORCAMENTOS = [];
//     }
//
//     let orcamento = ORCAMENTOS.find(i => parseInt(i.CodigoOrcamento) === parseInt(obj.CodigoOrcamento));
//
//     console.log("manipula Orc ->");
//     console.log(orcamento)
//
//     if (acao == 'I'){
//
//         if ( typeof orcamento  === 'undefined'){
//             ORCAMENTOS.push(obj);
//             retorno = true;
//         }
//
//
//     }else if (acao == 'A'){
//             console.log(ORCAMENTOS.findIndex(i => parseInt(i.CodigoOrcamento) === parseInt(obj.CodigoOrcamento)))
//             ORCAMENTOS[ORCAMENTOS.findIndex(i => parseInt(i.CodigoOrcamento) === parseInt(obj.CodigoOrcamento))] = obj;
//             retorno = true;
//
//
//     }else if (acao == 'D'){
//          ORCAMENTOS.splice((ORCAMENTOS.map(function(i) { return i.CodigoOrcamento; })
//          .indexOf(obj.CodigoOrcamento)), 1);
//
//     }
//
//     console.log(ORCAMENTOS)
//     sessionStorage.setItem('lista-orcamentos-consulta', JSON.stringify(ORCAMENTOS));
//     return retorno;
// }



function constroiDivOrcamento(dadosOrcamento){
    let lastObj = ORCAMENTOS[ORCAMENTOS.length - 1];
    let obj = orcamentoObj(dadosOrcamento.CODIGO);

    if (!manipulaListaOrcamentos('I', obj)){
        $("#baseIcon-"+obj.CodigoOrcamento).trigger('click');
        return;
        /*CASO O ORÇAMENTO JA ESTEJA ABERTO,
        * NÃO IRÁ MONTAR AS ABAS */
    }


   loadDiv('card-consulta-list-orc', 'B');
    $(`<li class="nav-item" id="${obj['LI']}">
                            <a class="nav-link" data-toggle="tab" aria-controls="tabIcon13" id="baseIcon-${dadosOrcamento.CODIGO}" href="#${obj['TAB']}" >
                                 <button type="button" class="close" onclick="destroiDivOrcamento(${dadosOrcamento.CODIGO})" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">x</span>
                                </button>
                                Orcamento ${dadosOrcamento.CODIGO}
                            </a>
                        </li>`).insertAfter("#"+lastObj['LI']);


    $(`<div role="tabpanel" class="tab-pane" id="${obj['TAB']}" aria-labelledby="${obj['TAB']}">
            <div id="${obj['FRAME']}"> </div>
      </div>`).insertAfter("#"+lastObj['TAB']);


    $("#"+obj['FRAME'] ).load( "/ConsultarOrcamento/"+dadosOrcamento.CODIGO, function() {

        let e = $("#"+obj['FRAME']).find('#body-consulta-orcamento');
        $("#"+obj['FRAME']).html(e[0]);
        // console.log(e[0]);
        //
        // $("#"+obj['FRAME']).children().hide();
        // $("#"+obj['FRAME']).children().css('display','none');
        // $("#"+obj['FRAME']).find(".app-content").css('display','');


        loadDiv('card-consulta-list-orc', 'L');
        $("#baseIcon-"+dadosOrcamento.CODIGO).trigger('click');
    });
}





function destroiDivOrcamento(codigoOrcamento){
    let obj = orcamentoObj(codigoOrcamento);
    manipulaListaOrcamentos('D', obj);
    $( "#"+obj['LI'] ).remove(  );
    $( "#"+obj['TAB'] ).remove(  );
    $("#baseIcon-0").trigger('click');

}
