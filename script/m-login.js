function setCookie(name,value){
    var days=7;
    var exp=new Date();
    exp.setTime(exp.getTime()+days*24*60*60*1000);
    document.cookie=name+"="+escape(value)+";expires="+exp.toGMTString();
}

function getusername(){
    var cookies=document.cookie;
    var start;
    var end;
    var target="username"+"=";
    if(cookies.length>0){
       start=cookies.indexOf(target);
        if(start!=-1){
            start+=target.length;
            end=cookies.indexOf(";",start);
            if(end==-1){
                end=cookies.length;
            }
        }
    }
    var value=cookies.substring(start,end);
    return value;
}
function getpassword(){
    var cookies=document.cookie;
    var start;
    var end;
    var target="password"+"=";
    if(cookies.length>0){
        start=cookies.indexOf(target);
        if(start!=-1){
            start+=target.length;
            end=cookies.indexOf(";",start);
            if(end==-1){
                end=cookies.length;
            }
        }
    }
    var value=cookies.substring(start,end);
    return value;
}
$().ready(function() {
        var username=getusername();
        var password=getpassword();
        $("#username").val(username);
        $("#password").val(password);
        var flag=0;
    $("#remember").click(function(){
        if(flag==0){
            flag=1;
        }
        else{
            flag=0;
        }
    });
    $("#loginbtn").click(function () {
        if($("#username").val()==""||$("#password").val()==""){
            alertMsg("请输入用户名和密码",$("#login-box"),"error");
            return false;
        }
        setCookie("username",$("#username").val());
        if(flag==0) {
            setCookie("password", "");
        }
        else{
            setCookie("password", $("#password").val());
        }
        var hash0 = hex_md5($("#password").val());
        $("#password").val(hash0);
        $.ajax({
        type: "post",
        url: "",
        data:$("#loginForm").serialize(),
        dataType: "text",
        success: function (data) {
            if(data){
                alertMsg("登陆成功",$("#login-box"),"success");
            }
            else{
                alertMsg("用户名或密码错误",$("#login-box"),"error");
            }
        },
        error: function () {
            alertMsg("未知错误",$("#login-box"),"error");
        }
        })
    });

});