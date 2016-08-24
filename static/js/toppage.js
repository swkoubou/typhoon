var cleate = function(){
    var id = document.getElementById('newname').value;
    var pass = document.getElementById('newpass').value;
    var kaku = document.getElementById('kakunin').value;

    if(pass != kaku)return;
    $.ajax({
            type: 'POST',
            url: '/auth/signup',
            data: {
                username: id,
                password: pass
            },
            success: function (data) {
                alert("OK");
            },
            error: function () {
                $("#sitazyo").text("error!!");
                document.getElementById('newname').value = "";
                document.getElementById('newpass').value = "";
                document.getElementById('kakunin').value = "";
            }
        });
};

var login = function () {
    var id  = document.getElementById('name').value;
    var pass = document.getElementById('pass').value;
    $.ajax({
        type:'POST',
        url:'/auth/login',
        data:{
            username:id,
            password:pass
        },
        success:function(data){
            alert("OK");
        },
        error:function () {
            $("#uezyo").text("error!!");
            document.getElementById('name').value = "";
            document.getElementById('pass').value = "";
        }
    });
};

