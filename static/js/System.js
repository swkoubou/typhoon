$(document).ready(function () {
    if(!window.console) window.console ={};
    if(!window.console.log) window.console.log = function () {}

    $("#send").on("click",function () {
        newMessage($(this));
        return false;
    });

    $("#bottom").keypress(function (e) {
        if(e.keyCode == 13){
            newMessage($(this));
            return false;
        }
    });
    updater.start();
});

function newMessage(form){
    send();
    //var message = form.formToDict();
    //updater.socket.send(JSON.stringify(message));//messageを送信
}

jQuery.fn.formToDict = function() {
    var fields = this.serializeArray();
    var json = {};
    for (var i = 0; i < fields.length; i++) {
        json[fields[i].name] = fields[i].value;
    }
    if (json.next) delete json.next;
    return json;
};

var updater = {
    socket: null,

    start: function() {
        var url = "ws://" + location.host + "/chatsocket"; //接続先URL
        updater.socket = new WebSocket(url); //WebSocketオブジェクト
        updater.socket.onmessage = function(event) { //onmessage メッセージ受信イベント
            updater.showMessage(JSON.parse(event.data));
        }
    },

    showMessage: function(message) { //変わらず
        var i = $('#main').sortable("toArray");
        for(var p = 0;p<i.length;p++){
            if(message.room_id == $("#" + i[p]+"> .ue > .title").text()){
                $("#"+i[p]+" .come").append("<p class='nusi'>"+message.username+"</p>" + "<p class='yonex'>"+message.comment+"</p>");
                $("#"+i[p] +" .come p:last").hide().slideDown();
                $('.come').animate({scrollTop: $('.come')[0].scrollHeight}, 'fast');
            }
        }
    }
};
