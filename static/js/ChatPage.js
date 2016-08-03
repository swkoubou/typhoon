var look = "";

window.onload = function aa(){
    var flag = true;
    var sort = document.getElementById('sort');
    $(function () {
        $('#main').sortable({
            cursor: 'move',
            axis: 'x',
            revert: 150,
            delay: 0,
            tolerance: "pointer"
        });
        $('#main').disableSelection();
        $('#main').sortable("disable");
    });
    $(function () {
        $('#sort').sortable({
            cursor: 'move',
            axis: 'y',
            revert: 150,
            delay: 0,
            opacity: 0.9,
            tolerance: "pointer"
        });
        $('#sort').disableSelection();
    });
    $(function () {
        $('#op').click(function(){
            if(flag == false){
                $('#left').animate({left:"0%"});
                $('#main').animate({width:"90%",left:"10%"});
                $('#bottom').animate({width:"90%",left:"10%"});
                $('.menu >span').animate({left:"-60%"});
                $('.menu > p').show();
                flag = true;
            }else {
                $('#left').animate({left: "-6%"});
                $('#main').animate({width:"96%",left:"4%"});
                $('#bottom').animate({width:"96%",left:"4%"});
                $('.menu >span').animate({left:"130%"});
                $('.menu > p').hide();
                flag = false;
            }
        });
    });
    pp();
    standby();
    list();
    sort.addEventListener('mouseup',function () {setTimeout(pp,200)},false);
};

function send() {
    if(look == ""){
        alert("nassi");
        return;
    }
    var text = document.getElementById('text').value;
    if(text == ""){
        alert("nassi");
        return;
    }
    document.getElementById('text').value = "";//テキストボックスを空に
    $("#"+look +" .come").append("<p>"+text+"</p>");
    $("#"+look +" .come p:last").hide().slideDown();
}

function list(){
    var ku = $('#main').sortable("toArray");
    var list = new Array();
    for(var i = 0;i < ku.length;i++){
       list[i] =  $('#'+ku[i]+"> .ue > .title").text();
    }
    $("#roomedit").empty();
    for(var i = 0;i < list.length;i++){
        $("#roomedit").append("<input type=\"checkbox\" class=\"check\" value=\"" + list[i] + "\">" + list[i]);
    }
}

function ace() {
    var i = $('#main').sortable("toArray");
    var arr = [];
    $("#sort div").each(function(){
        arr.push($(this).html());
    });
    $("#sort").empty();
    for(p = 0;p < arr.length;p++) {
        var ge = document.getElementById(i[p]).getElementsByClassName('title');
        var ser = ge[0].innerHTML;
        for (z = 0; z < arr.length; z++) {
            if (arr[z].indexOf(ser) != -1) {
                $("#sort").append('<div id="le' + i[p] + '" class="menu">' + arr[z] + '</div>');
            }
        }
    }
}

function  standby() {
    $(function () {
        $('.glyphicon-resize-horizontal').mousedown(function () {
            $('#main').sortable("enable");
        });
    });
    $(function () {
        $('body').mouseup(function () {
            $('#main').sortable("disable");
            setTimeout(ace,200);
        });
    });
    $(function () {
        $('.glyphicon-pencil').click(function () {
            var color = $(this).parent().parent().css("background-color");
            $('#send').animate({"backgroundColor":color});
            look = $(this).parent().parent().attr('id');
        });
    });
    ace();
}

function pp() {
    var i = $('#sort').sortable("toArray");
    var arr = [];
    $("#main div").each(function(){
        arr.push($(this).html());
    });
    $("#main").empty();
    for(p = 0;p < 4;p++) {
        for (z = 0; z < arr.length; z++) {
            if (arr[z].indexOf(i[p].substr(2)) != -1) {
                if(arr[z].indexOf('<div class="ue">')!= -1) {
                    $("#main").append('<div id="' + i[p].substr(2) + '">' + arr[z] + '</div>');
                }
            }
        }
    }
    standby();
};