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
        var existing = $("#m" + message.id);
        if (existing.length > 0) return;
        var node = $(message.html);
        node.hide(); //隠す
        $("#inbox").append(node); //inbox末尾にnodeを挿入
        node.slideDown(); //挿入時のアニメーション
    }
};