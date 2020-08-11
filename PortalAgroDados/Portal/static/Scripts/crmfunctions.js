var codigoColaborador = $("#input-codigo").val();


//    alert('chegou');
//    alert(codigoColaborador);

if (codigoColaborador) {

    GetMenusBloqueadosJson(codigoColaborador);
    GetMenusLiberadosJson(codigoColaborador);
}


function GetMenusBloqueadosJson(codigoColaborador) {
    $.ajax({
        dataType: "json",
        type: "GET",
        url: "/Acessos/GetMenusBloqueadosJson/" + codigoColaborador,
        async: false,
        success: function (data) {
            $("#modulos-bloqueados").html("");
            var htmladd = "";
            $(data).each(function (i) {
                htmladd += "<li class='dd-handle' draggable='true' ondragstart='drag(event)' id='" + data[i].CodigoSubmenu + "'>" + data[i].DescricaoSubmenu + "</li>";
            });
            $("#modulos-bloqueados").html(htmladd);
        },
        error: function (data) {
            alert("Erro ao executar GetMenusBloqueadosJson");
        }
    });
}
function PostBoqueiaAutorizaMenus(codigoColaborador, codigoSubMenu, referencia) {
    $.ajax({
        dataType: "json",
        type: "POST",
        url: "/Acessos/PostProcessaSubMenus?" +
            "codigoColaborador=" + codigoColaborador +
            "&codigoSubMenu=" + codigoSubMenu +
            "&referencia=" + referencia,
        async: false,
        success: function (data) {
            GetMenusBloqueadosJson(codigoColaborador);
            GetMenusLiberadosJson(codigoColaborador);
        }
    });

}
function GetMenusLiberadosJson(codigoColaborador) {
    $.ajax({
        dataType: "json",
        type: "GET",
        url: "/Acessos/GetMenusLiberadosJson/" + codigoColaborador,
        async: false,
        success: function (data) {
            $("#modulos-liberados").html("");
            var htmladd = "";
            $(data).each(function (i) {
                htmladd += "<li class='dd-handle' draggable='true' ondragstart='drag(event)' id='" + data[i].CodigoSubmenu + "'>" + data[i].DescricaoSubmenu + "</li>";
            });
            $("#modulos-liberados").html(htmladd);
        }
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {

    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    PostBoqueiaAutorizaMenus(codigoColaborador, data, ev.target.id);

}

