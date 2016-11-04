var look = "";
var liste = new Array();
var totalcome = {'共通ルーム': null,'hoge':null,'huge':null,'hige':null};
var ic = {'one':'glyphicon glyphicon-book','two':'glyphicon glyphicon-star','three':'glyphicon glyphicon-bell','four':'glyphicon glyphicon-signal'};
var ici,ni,san,yon;

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
                $('.menu >span').animate({left:"0%"});
                $('.menu > p').show();
                $('#typ').animate({width:"90%",height:"15%"});
                flag = true;
            }else {
                $('#left').animate({left: "-6%"});
                $('#main').animate({width:"96%",left:"4%"});
                $('#bottom').animate({width:"96%",left:"4%"});
                $('.menu >span').animate({left:"60%"});
                $('.menu > p').hide();
                $('#typ').animate({width:"40%",height:"10%"});
                flag = false;
            }
        });
    });

    var ku = $('#main').sortable("toArray");
    for(var i = 0;i < ku.length;i++) {
        liste[i] = $('#' + ku[i] + "> .ue > .title").text();
    }
    console.log(liste);

    pp();
    list();
    standby();
    komeget();
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
    var user = $('#namae').text();
    var room = $("#" +look +"> .ue > .title").text();
    document.getElementById('text').value = "";//テキストボックスを空に

    var uho ={
        username:user,
        room_id:room,
        comment:text
    };

    updater.socket.send(JSON.stringify(uho));


}

function list(){

    $("#ici").empty();
    $("#ni").empty();
    $("#san").empty();
    $("#yon").empty();


    for(var i = 0;i < liste.length;i++){
        $("#ici").append("<option value=\""+liste[i] +"\">" + liste[i] +"</option>");
        $("#ni").append("<option value=\""+liste[i] +"\">" + liste[i] +"</option>");
        $("#san").append("<option value=\""+liste[i] +"\">" + liste[i] +"</option>");
        $("#yon").append("<option value=\""+liste[i] +"\">" + liste[i] +"</option>");
    }
}

function aces() {
    var i = $('#main').sortable("toArray");
    var arr = [];
    $("#sort div").each(function(){
        arr.push($(this).html());
    });
    $("#sort").empty();
    for(p = 0;p < 4;p++) { //arr.length
        var ge = document.getElementById(i[p]).getElementsByClassName('title');
        var ser = ge[0].innerHTML;
        for (z = 0; z < 4; z++) {
        if(ser == ""){
            $("#sort").append('<div id="le' + i[p] + '" class="menu">' + '<span class="'+ ic[i[p]] +  '" aria-hidden="true"></span><p></p>' + '</div>');
            break;
        }
            if (arr[z].indexOf(ser) != -1) {
                $("#sort").append('<div id="le' + i[p] + '" class="menu">' + arr[z] + '</div>');
                break;            
            }
        }
    }
    return;
}

function  standby() {
    $(function () {
        $('.glyphicon-resize-horizontal').mousedown(function () {
            $('#main').sortable("enable");
        });
    });
    $(function () {
        $('#main').mouseup(function () {
            $('#main').sortable("disable");
            setTimeout(aces,200);
        });
    });
    $(function () {
        $('.glyphicon-pencil').click(function () {
            var color = $(this).parent().parent().css("background-color");
            console.log(color);
            $('#send').animate({"backgroundColor":color});
            look = $(this).parent().parent().attr('id');
        });
    });
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

function roomset() {
    var id = document.getElementById('roomname').value;
    var pass = document.getElementById('roompass').value;
    var user = $('#namae').text();


    if(!pass || !id) {
        alert("パスワードかアカウント名が空白");
        return;
    }

    var uho ={
        username:user,
        room_id: id,
        password: pass
    };

    alert("OK");
    liste.push(id);
    totalcome[id] = null;
    list();
    $('#roomad').modal('hide');
   /* $.ajax({
        type: 'POST',
        url: '/room/create',
        data:JSON.stringify(uho),
        dataType:"json",
        success: function (data) {
            if(data.is_success == "true"){
                alert("OK");
                liste.push(id);
                totalcome[id] = null;
                list();
                $('#roomad').modal('hide');
            }else{
                alert("error!!");
            }
        },
        error: function () {
            alert("kuso");
        }
    });*/
}

function roomjoin() {
    var id = document.getElementById('roomname').value;
    var pass = document.getElementById('roompass').value;
    var user = $('#namae').text();


    if(!pass || !id) {
        alert("パスワードかアカウント名が空白");
        return;
    }

    var uho ={
        username:user,
        room_id: id,
        password: pass
    };

    alert("OK");
    liste.push(id);
    list();
    $('#roomad').modal('hide');

    /*$.ajax({
        type: 'POST',
        url: '/room/enter',
        data:JSON.stringify(uho),
        dataType:"json",
        success: function (data) {
            if(data.is_success == "true"){
                alert("OK");
                liste.push(id);
                list();
                $('#roomad').modal('hide');
            }else{
                alert("error!!");
            }
        },
        error: function () {
            alert("kuso");
        }
    });*/
}

function change() {
    komeget();

    $(".come").empty();

     ici = document.getElementById('ici').value;
     ni = document.getElementById('ni').value;
     san= document.getElementById('san').value;
     yon = document.getElementById('yon').value;

    $('#leone > span').className = ic[one];
    $('#two > span').className = ic[two];
    $('#three > span').className = ic[three];
    $('#four > span').className = ic[four];

    $('#one > .ue > .title').text(ici);
    $('#two > .ue > .title').text(ni);
    $('#three > .ue > .title').text(san);
    $('#four > .ue > .title').text(yon);

    $('#leone > p').text(ici);
    $('#letwo > p').text(ni);
    $('#lethree > p').text(san);
    $('#lefour > p').text(yon);

    $('#one > .come').html(totalcome[ici]);
    $('#two > .come').html(totalcome[ni]);
   $('#three > .come').html(totalcome[san]);
    $('#four > .come').html(totalcome[yon]);
    

    $('#myModal').modal('hide');
    
    
}

function komeget(){
    var an = $('#one').find('.title').html();
    totalcome[an] = $('#one').children('.come').html();
    an = $('#two').find('.title').text();
    totalcome[an] = $('#two').children('.come').html();
    var an = $('#three').find('.title').text();
    totalcome[an] = $('#three').children('.come').html();
    var an = $('#four').find('.title').text();
    totalcome[an] = $('#four').children('.come').html();

    console.log(totalcome);

}
