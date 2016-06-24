/**
 * Created by GDH on 2016/6/16.
 */
var userInfo={};
$.ajax({
    type: "post",
    url: "getLoginUserMessage",
    dataType: "json",
    success: function (data) {
        userInfo=data;
        console.log(data);
    },
    error: function (msg) {
        document.write(msg);
    }
});