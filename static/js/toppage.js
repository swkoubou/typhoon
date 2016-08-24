var cleate = function(){
    var id = document.getElementById('newname').value;
    var pass = document.getElementById('newpass').value;
    var kaku = document.getElementById('kakunin').value;

    if(pass != kaku) {
        $("#sitazyo").text("パスワードが一致しません");
        return;
    }
    if(!pass || !id) {
        $("#sitazyo").text("パスワードかアカウント名が空白");
        return;
    }

    var uho ={
        username: id,
        password: pass
    };


    $.ajax({
            type: 'POST',
            url: '/auth/signup',
            data:JSON.stringify(uho),
        dataType:"json",
            success: function (data) {
               if(data.is_success == "true"){
                   location.href ="/";
               }else{
                   $("#sitazyo").text("既にあるアカウント");
               }
            },
            error: function () {
                $("#sitazyo").text("通信エラー");
                document.getElementById('newname').value = "";
                document.getElementById('newpass').value = "";
                document.getElementById('kakunin').value = "";
            }
        });
};

var login = function () {
    var id  = document.getElementById('name').value;
    var pass = document.getElementById('pass').value;

    var uho ={
        username: id,
        password: pass
    };

    $.ajax({
        type:'POST',
        url:'/auth/login',
        data:JSON.stringify(uho),
        dataType:"json",
        success:function(data){
            if(data.is_success == "true"){
                location.href ="/";
            }else{
                $("#sitazyo").text("ユーザー名が違うかパスワードが一致しません");
            }
        },
        error:function () {
            $("#uezyo").text("通信エラー");
            document.getElementById('name').value = "";
            document.getElementById('pass').value = "";
        }
    });
};
