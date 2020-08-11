
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

String.prototype.replaceAll = String.prototype.replaceAll || function (needle, replacement) {
    return this.split(needle).join(replacement);
};

function grafico_limite(grafico) {
    if( grafico.GRAFICO_LIMITE.length > 0){
        GRAFICO_LIMITE = grafico.GRAFICO_LIMITE;
        for (i in GRAFICO_LIMITE){
            $("#labelLimiteTotalCliente").html(GRAFICO_LIMITE[i]['LIMITE_MAXIMO'])
            $("#labelLimiteDisponivel").html(GRAFICO_LIMITE[i]['LIMITE_DISPONIVEL'])
            $("#labelLimiteEmUso").html(GRAFICO_LIMITE[i]['LIMITE_MAXIMO_ATUAL'])
            $("#knobb-LimiteTotalCliente").attr('data-max',GRAFICO_LIMITE[i]['LIMITE_MAXIMO_KNOB'])
            $("#knobb-LimiteTotalCliente").attr('value',GRAFICO_LIMITE[i]['LIMITE_MAXIMO_ATUAL_KNOB'])
        }
    }
}

function grafico_empenho(grafico) {
    if (grafico.GRAFICO_EMPENHO.length > 0){
        GRAFICO_EMPENHO = grafico.GRAFICO_EMPENHO
        var y = [];
        for (x in GRAFICO_EMPENHO) {
            if (TEM_EMPENHO == 'TRUE'){
                LABEL_GRAFICO_EMPENHO = ["Valor Empenhado", "Valor Faturado", "Valor Provisionado", "Valor Total Gastos","Saldo"]
            }
            else{
                 LABEL_GRAFICO_EMPENHO = ["Valor Contratado", "Valor Faturado", "Valor Provisionado", "Valor Total Gastos","Saldo"]
            }
            y = [GRAFICO_EMPENHO[x]['VALOR'],GRAFICO_EMPENHO[x]['VALOR_FATURADO'],GRAFICO_EMPENHO[x]['VALOR_PROVISIONADO'],GRAFICO_EMPENHO[x]['VALOR_TOTAL_GASTO'],GRAFICO_EMPENHO[x]['SALDO']]
            $("#labelValor").removeClass('hide')
            $("#labelSaldo").removeClass('hide')
            $("#labelValorTotalGastos").removeClass('hide')
            $("#labelValorFaturado").removeClass('hide')
            $("#labelValorProvisionado").removeClass('hide')
            $("#labelValor").html(GRAFICO_EMPENHO[x]['VALOR_FORMATADO'])
            $("#labelSaldo").html(GRAFICO_EMPENHO[x]['SALDO_FORMATADO'])
            $("#labelValorTotalGastos").html(GRAFICO_EMPENHO[x]['VALOR_TOTAL_GASTO_FORMATADO'])
            $("#labelValorFaturado").html(GRAFICO_EMPENHO[x]['VALOR_FATURADO_FORMATADO'])
            $("#labelValorProvisionado").html(GRAFICO_EMPENHO[x]['VALOR_PROVISIONADO_FORMATADO'])
            $("#labelPeriodo").removeClass('hide')
            $("#labelPeriodo").html(GRAFICO_EMPENHO[x]['PERIODO'])
            $("#labelValorLicitacao").removeClass('hide')
            $("#labelValorLicitacao").html('Valor Contratado: ' + GRAFICO_EMPENHO[x]['VALOR_LICITACAO_FORMATADO'])

            GRAFICO_EMPENHO = y;
            carrega_grafico_empenho();
        }
    }else{
        LABEL_GRAFICO_EMPENHO = ['Valor']
        GRAFICO_EMPENHO = [0]
    }
}

function grafico_ranking(grafico) {
    if (grafico.GRAFICO_RANKING.length > 0){
        GRAFICO_RANKING = grafico.GRAFICO_RANKING
        for (x in GRAFICO_RANKING) {
            LABEL_GRAFICO_RANKING.push(GRAFICO_RANKING[x]['PLACA'])
            VALOR_GRAFICO_RANKING.push(GRAFICO_RANKING[x]['VALOR_TOTAL'])
            PERCENTUAL_GRAFICO_RANKING.push(GRAFICO_RANKING[x]['PERCENTUAL'])
        }

    }
    carrega_grafico_ranking();
}

function grafico_status_orc(grafico) {
    if(grafico.DADOS.length > 0){
        GRAFICO = grafico.DADOS
        for (transacao in GRAFICO) {
        if (GRAFICO[transacao]['STATUS'] == 'ER'){
            var emRevisao = (GRAFICO[transacao]['QTD']);
            var emRevisaoDesc = (GRAFICO[transacao]['DESCRICAO_STATUS']);
            $(document).ready(function () {
                document.getElementById('hrefRevisao').setAttribute('href', 'ConsultaListaOrcamento/ER');
                $("#lblEmRevisao").html(`( ${emRevisao} )`);
                $("#lblEmRevisaoDesc").html(emRevisaoDesc);
                document.getElementById('qtdValueEr').setAttribute('value', emRevisao);
            });
        }
        if (GRAFICO[transacao]['STATUS'] == 'SO'){
            var solicitado = (GRAFICO[transacao]['QTD']);
            var solicitadoDesc = (GRAFICO[transacao]['DESCRICAO_STATUS']);
            $(document).ready(function () {
                document.getElementById('hrefSolicitado').setAttribute('href', 'ConsultaListaOrcamento/SO');
                $("#lblSolicitado").html(`( ${solicitado} )`);
                $("#lblSolicitadoDesc").html(solicitadoDesc);
                document.getElementById('qtdValueSo').setAttribute('value', solicitado);
            });
        }
        if (GRAFICO[transacao]['STATUS'] == 'AP'){
            var aprovado = (GRAFICO[transacao]['QTD']);
            var aprovadoDesc = (GRAFICO[transacao]['DESCRICAO_STATUS']);
            $(document).ready(function () {
                document.getElementById('hrefAprovado').setAttribute('href', 'ConsultaListaOrcamento/AP');
                $("#lblAprovado").html(`( ${aprovado} )`);
                $("#lblAprovadoDesc").html(aprovadoDesc);
                document.getElementById('qtdValueAp').setAttribute('value', aprovado);
            });
        }
        if (GRAFICO[transacao]['STATUS'] == 'CC'){
            var concluido = (GRAFICO[transacao]['QTD']);
            var concluidoDesc = (GRAFICO[transacao]['DESCRICAO_STATUS']);
            $(document).ready(function () {
                document.getElementById('hrefConcluido').setAttribute('href', 'ConsultaListaOrcamento/CC');
                $("#lblConcluido").html(`( ${concluido} )`);
                $("#lblConcluidoDesc").html(concluidoDesc);
                document.getElementById('qtdValueCc').setAttribute('value', concluido);
            });
        }
        if (GRAFICO[transacao]['STATUS'] == 'EE'){
            var emExecucao = (GRAFICO[transacao]['QTD']);
            var emExecucaoDesc = (GRAFICO[transacao]['DESCRICAO_STATUS']);
            $(document).ready(function () {
                document.getElementById('hrefExecucao').setAttribute('href', 'ConsultaListaOrcamento/EE');
                $("#lblEmExecucao").html(`( ${emExecucao} )`);
                $("#lblEmExecucaoDesc").html(emExecucaoDesc);
                document.getElementById('qtdValueEe').setAttribute('value', emExecucao);
            });
        }
        if (GRAFICO[transacao]['STATUS'] == 'AA'){
            var aguardandoAutorizacao = (GRAFICO[transacao]['QTD']);
            var aguardandoAutorizacaoDesc = (GRAFICO[transacao]['DESCRICAO_STATUS']);
            $(document).ready(function () {
                document.getElementById('hrefAguardandoA').setAttribute('href', 'ConsultaListaOrcamento/AA');
                $("#lblAguardandoAutorizacao").html(`( ${aguardandoAutorizacao} )`);
                $("#lblAguardandoAutorizacaoDesc").html(aguardandoAutorizacaoDesc);
                document.getElementById('qtdValueAa').setAttribute('value', aguardandoAutorizacao);
            });
        }
        if (GRAFICO[transacao]['STATUS'] == 'EA'){
            var emAnalise = (GRAFICO[transacao]['QTD']);
            var emAnaliseDesc = (GRAFICO[transacao]['DESCRICAO_STATUS']);
            $(document).ready(function () {
                document.getElementById('hrefAnalise').setAttribute('href', 'ConsultaListaOrcamento/EA');
                $("#lblEmAnalise").html(`( ${emAnalise} )`);
                $("#lblEmAnaliseDesc").html(emAnaliseDesc);
                document.getElementById('qtdValueFc').setAttribute('value', emAnalise);
            });
        }
    }
    }
    if (grafico.GRAFICO.length > 0){

        GRAFICO = grafico.GRAFICO
        for (x in GRAFICO) {
                GRAFICO_ORC.push({ "label" : GRAFICO[x]['DESCRICAO_STATUS'], "value": GRAFICO[x]['QTD'] });
            }
    }
    carrega_grafico_orcamento();

}
function carrega_grafico_orcamento(){
    Morris.Donut({
        element: 'donut-chart',
        data: GRAFICO_ORC,
        resize: true,
        colors: ['#77c96d','#3f4444', '#fb3954', '#2a8cce','#3bbfad', '#015d37', '#f4fb29', '#c2185b', '#1976d2', '#7b1fa2']
    });
};

function carrega_grafico_empenho(){
    var ctx = $("#simple-pie-chart");

    // Chart Options
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration:500,
    };

    // Chart Data
    var chartData = {
        labels: LABEL_GRAFICO_EMPENHO,
        // labels: ["Valor", "Valor Faturado", "Valor Provisionado", "Valor Total Gasto","Saldo"],
        datasets: [{
            // label: "My First dataset",
            data: GRAFICO_EMPENHO,
            // data: ['1510.09', 65, 34, 45, 35],
            //backgroundColor: ['', '#d38f00', '#686e9f','#3bbfad', '#76c96e'],
            backgroundColor: ['#686e9f', '#FF7F50','#3bbfad', '#d38f00', '#76c96e'],
        }]
    };

    var config = {
        type: 'pie',

        // Chart Options
        options : chartOptions,

        data : chartData
    };

    // Create the chart
    var pieSimpleChart = new Chart(ctx, config);
}

function carrega_grafico_ranking(){
    var ctx = $("#combo-bar-line");

    // Chart Options
    var chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            xAxes: [{
                display: true,
                gridLines: {
                    color: "#f3f3f3",
                    drawTicks: false,
                },
//                scaleLabel: {
//                    display: true,
//                    labelString: 'Placas'
//                }
            }],
            yAxes: [{
                display: true,
                gridLines: {
                    color: "#f3f3f3",
                    drawTicks: false,
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Valores'
                }
            }]
        },
        title: {
            display: false,
            text: 'Chart.js Combo Bar Line Chart'
        }
    };

    // Chart Data
    var chartData = {
        labels: LABEL_GRAFICO_RANKING,
        datasets: [
        //     {
        //     type: 'line',
        //     label: "My Second dataset",
        //     data: PERCENTUAL_GRAFICO_RANKING,
        //     backgroundColor: "rgba(250,142,117,.5)",
        //     borderColor: "transparent",
        //     borderWidth: 2,
        //     pointBorderColor: "#FA8E75",
        //     pointBackgroundColor: "#FFF",
        //     pointBorderWidth: 2,
        //     pointHoverBorderWidth: 2,
        //     pointRadius: 4,
        // }
        {
            type: 'bar',
            label: 'Valor Total',
            // data: [65, 59, 80, 81, 56, 55, 40.50,50,50],
            data: VALOR_GRAFICO_RANKING,
            backgroundColor: "#597d5e",
            borderColor: "transparent",
            borderWidth: 2
        }
        // ,{
        //     type: 'bar',
        //     label: "My Third dataset - No bezier",
        //     data: PERCENTUAL_GRAFICO_RANKING,
        //     backgroundColor: "#F25E75",
        //     borderColor: "transparent",
        //     borderWidth: 2
        // }
        ]
    };

    var config = {
        type: 'bar',

        // Chart Options
        options : chartOptions,

        data : chartData
    };

    // Create the chart
    var lineChart = new Chart(ctx, config);
}



