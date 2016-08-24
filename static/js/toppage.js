var cleate = function(){
    var id = document.getElementById('newname');
    var pass = document.getElementById('newpass');
    var kaku = document.getElementById('kakunin');

    if(pass != kaku)return;
    
    $.ajax({
        type:'POST',
        url:'/auth/signup',
        data:{
            username:id,
            password:pass
        },
        success:function(data){
           alert("OK"); 
        },
        error:function () {
            document.getElementById('sitazyo').value = "Error!!";
            document.getElementById('newname').value = "";
            document.getElementById('newpass').value = "";
            document.getElementById('kakunin').value = "";
        }
    });
};

var login = function () {
    var id  = document.getElementById('name');
    var pass = document.getElementById('pass');
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
            document.getElementById('uezyo').value = "Error!!";
            document.getElementById('name').value = "";
            document.getElementById('pass').value = "";
        }
    });
};

