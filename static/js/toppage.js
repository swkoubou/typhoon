var cleate = function(){
    var id = document.getElementById('newname').value;
    var pass = document.getElementById('newpass').value;
    var kaku = document.getElementById('kakunin').value;

    if(pass != kaku)return;

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
                   $("#sitazyo").text(data.reason);
               }
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
                $("#sitazyo").text(data.reason);
            }
        },
        error:function () {
            $("#uezyo").text("error!!");
            document.getElementById('name').value = "";
            document.getElementById('pass').value = "";
        }
    });
};

