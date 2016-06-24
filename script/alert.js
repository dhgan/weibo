/**
 * Created by GDH on 2016/6/21.
 */
function alertMsg(tips, $relative, type) {
    var src="./imgs/icon/success.png";
    if(type=="error") src="./imgs/icon/error.png";
    var $tips=$relative.siblings(".tips");
    if($tips.length>0) $tips.remove();
    $tips= $("<div class='tips'></div>");
    $tips.html("<img src='"+src+"'>"+tips)
        .appendTo($relative.parent())
        .ready(function () {
            $tips.css({
                "top": $relative.offset().top-$(window).scrollTop()+$relative.outerHeight()/2,
                "left": $relative.offset().left-$(window).scrollLeft()+$relative.outerWidth()/2,
                "margin-left": -$tips.outerWidth()/2,
                "margin-top": -$tips.outerHeight()/2,
                "visibility": "visible"
            });
        });
    setTimeout(function () {
        $tips.remove();
    },1500);
}