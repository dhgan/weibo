(function(){
    var emoji=[
        {"title": "呵呵"},
        {"title": "哈哈"},
        {"title": "吐舌"},
        {"title": "啊"},
        {"title": "酷"},
        {"title": "怒"},
        {"title": "开心"},
        {"title": "汗"},
        {"title": "泪"},
        {"title": "黑线"},
        {"title": "鄙视"},
        {"title": "不高兴"},
        {"title": "真棒"},
        {"title": "钱"},
        {"title": "疑问"},
        {"title": "阴险"},
        {"title": "吐"},
        {"title": "咦"},
        {"title": "委屈"},
        {"title": "花心"},
        {"title": "呼~"},
        {"title": "笑眼"},
        {"title": "冷"},
        {"title": "太开心"},
        {"title": "滑稽"},
        {"title": "勉强"},
        {"title": "狂汗"},
        {"title": "乖"},
        {"title": "睡觉"},
        {"title": "惊哭"},
        {"title": "升起"},
        {"title": "惊讶"},
        {"title": "喷"},
        {"title": "爱心"},
        {"title": "心碎"},
        {"title": "玫瑰"},
        {"title": "礼物"},
        {"title": "彩虹"},
        {"title": "星星月亮"},
        {"title": "太阳"},
        {"title": "钱币"},
        {"title": "灯泡"},
        {"title": "茶杯"},
        {"title": "蛋糕"},
        {"title": "音乐"},
        {"title": "haha"},
        {"title": "胜利"},
        {"title": "大拇指"},
        {"title": "弱"},
        {"title": "OK"}
    ];
    for(var i=1;i<=50;i++){
        if(i<10) i="0"+i;
        emoji[i-1].url="./imgs/emoji/i_f"+i+".png";
    }
    $.fn.clipImg=function() {
        if(!this[0]) return;
        var imgW=this[0].naturalWidth;
        var imgH=this[0].naturalHeight;
        var constW=this.parent().width();
        var oImg=imgH<=imgW?{"l":imgW, "t": "width", "o": imgH}
            :{"l":imgH, "t": "height", "o": imgW};
        if(oImg["l"]>constW){
            var clip=Math.abs(imgH-imgW)/2*constW/oImg['o'];
            if(oImg['t']=="width"){
                this.css({
                    "width": "auto",
                    "height": constW,
                    "margin-left":  -clip

                });
            } else{
                this.css({
                    "width": constW,
                    "height": "auto",
                    "margin-top":  -clip

                });
            }
        }
    }
    $.fn.commentBoxEvent=function () {
        if(!this[0]) return;
        var _this=this;
        _this.on("click", function (e) {
            e.preventDefault();
            e.returnValue=false;
            e.stopPropagation();
            window.location.href="./page.html";
        })
    };
    function createMsgListDemo(info){
        var $msgListContentBox=$("<div class='msgListContentBox clearfix' data-msg-type='"+info.type+"'></div>")
        var $msgListContent=$("<div class='msgListContent'></div>");
        $("<div class='msgListUserInfo'>" +
            "<a href='"+info.userLink+"'>" +
            "<img src='"+info.userHead+"' class='msgListUserHead'/>" +
            "<strong class='msgListUserName'>"+info.userName+"</strong>"+
            "</a>" +
            "<a href='javascript:;' class='msgListTime'>"+info.msgListTime+"</a>" +
            "</div>").appendTo($msgListContent);
        var $msgListBodyDemo = $("<div class='msgListBodyDemo clearfix'></div>");
        var omit="";
        var src="";
        var title="";
        var msg="";
        if(info.type=="msgList"){
            if (info.msgPhoto.length > 0) {
                src=info.msgPhoto[0];
            };
            if(info.msgInfo.length>100) omit="...";
            msg=info.msgInfo.substring(0, 100);
        } else if(info.type=="article") {
            var $img = $(info.msgInfo).find("img");
            if ($img.length > 0) {
                src= $img[0].src;
            }
            title=info.msgTitle;
            var txt=$(info.msgInfo).text();
            if(txt>100) omit="...";
            msg=txt.substring(0, 100);
        }
        var $imgDemo = "<div><img src='" + src + "' /></div>";
        $msgListBodyDemo.html($imgDemo + title +
            msg + omit)
            .appendTo($msgListContent);
        $msgListBodyDemo.find("img").on("load",function () {
            $(this).clipImg();
        })
        $("<ul class='msgListFooter clearfix'>" +
            "<li class='msgLike'><i>&nbsp;</i><span>"+info.msgLike+"</span></li>" +
            "<li class='msgComment'><i>&nbsp;</i><span>"+info.msgComment+"</span><b></b></li></ul>")
            .appendTo($msgListContent);
        $msgListContent.appendTo($msgListContentBox);
        return $msgListContentBox;
    }
    var time=0;
    var info={
        type: "msgList",
        userLink: "#",
        msgListTime: "17:35",
        userHead: "./imgs/head.png",
        userName: "卡带机",
        msgInfo: "WWDC 大会将在下周举行了，在今年的这场大会上苹果公司将以更新软件为主，或许是因为这场大会上要发布的东西太多，苹果提前公开了将会在今年晚些时候更新的 App Store 2.0，这样到时候在 WWDC 大会上苹果就可以有针对性地对这次更新加以说明。被吐槽了这么多年的App Store要重新出发了~",
        msgTitle: "<h2>每个人都有的白T恤，但我就是穿的比你美！</h2>",
        msgReply: "柳岩不哭，强烈要求大国文化道歉#大国文化给柳岩道歉#",
        msgLink: "javascript:",
        msgPhotoNum: 6,
        msgPhoto: [
            "./imgs/11.jpg",
            "./imgs/2.jpg",
            "./imgs/3.jpg",
            "./imgs/1.jpg",
            "./imgs/3.jpg",
            "./imgs/2.jpg"
        ],
        msgLike: 66,
        msgComment: 6
    };
    var timer=setInterval(function () {
        if(time<5){
            time++;
            var m;
            if(time%2) {
                info.msgPhotoNum=time;
                m = createMsgListDemo(info);
                m.commentBoxEvent();
                m.appendTo($('.contentBox').eq(0));
            } else{
                info.msgInfo='<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白' +
                    '<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span>' +
                    '<font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><a href="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg" target="_blank"><img src="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg"></a><p>' +
                    '<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span><font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><p>';
                info.type="article";
                info.msgInfo+=info.msgInfo;
                m=createMsgListDemo(info);
                m.commentBoxEvent();
                m.appendTo($('.contentBox'));
            }
        }else{
            clearInterval(timer);
        }

    },100);
    function dragDrop($target,$dragUtil) {
        var disX, disY, flag=false;
        $dragUtil.on("mousedown", function (e) {
            e.returnValue=false;
            e.stopPropagation();
            e.preventDefault();
            disX=$target.offset().left-e.pageX;
            disY=$target.offset().top-e.pageY;
            flag=true;
            if($dragUtil.setCapture) {
                $dragUtil.setCapture();
            }
        });
        function mousemove(e) {
            e.returnValue=false;
            e.stopPropagation();
            if(flag){
                $target.offset({
                    "left": (disX+e.pageX),
                    "top": (disY+e.pageY)
                });
            };
        }
        function mouseup(e) {
            e.returnValue=false;
            e.stopPropagation();
            flag=false;
            if(document.releaseCapture){
                document.releaseCapture();
            }
        }
        $(document).on("mousemove", mousemove);
        $(document).on("mouseup", mouseup);
    }
    $(window).on("scroll resize", function () {
        if($(window).scrollTop()+$(window).height()==$(document.body).outerHeight(true)) {
            for(var time=0;time<5;time++){
                if(time%2) {
                    info.msgPhotoNum=time;
                    m = createMsgListDemo(info);
                    m.commentBoxEvent();
                    m.appendTo($('.contentBox').eq(0));
                } else{
                    info.msgInfo='<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白' +
                        '<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span>' +
                        '<font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><a href="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg" target="_blank"><img src="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg"></a><p>' +
                        '<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span><font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><p>';
                    info.type="article";
                    info.msgInfo+=info.msgInfo;
                    m=createMsgListDemo(info);
                    m.commentBoxEvent();
                    m.appendTo($('.contentBox').eq(0));
                }
            }
        }
    });
    function createLoad() {
        return $("<div class='msgLoad'>" +
            "<img src='./imgs/icon/load.png'>" +
            "正在加载，请稍后" +
            "</div>");
    }
    function createEmpty() {
        return $("<div class='msgEmpty'>" +
            "所符合的内容为空" +
            "</div>")
    }

    function replaceEmoji(msg) {
        return msg.replace(/\[([^\[\]]+)\]/g, function ($0,$1) {
            var src="";
            emoji.forEach(function (value) {
                if(value.title==$1){
                    src="<img src='"+value.url+"' class='emoji'/>";
                    return;
                }
            });
            console.log(src);
            if(src) return src;
            return $1;
        });
    }

})();

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