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
    function createObjectURL(blob) {
        if(window.URL){
            return window.URL.createObjectURL(blob);
        } else if(window.webkitURL){
            return window.webkitURL.createObjectURL(blob);
        } else {
            return null;
        }
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
    //检测微博字数
    $.fn.msgTxtDetect=function(option){
        if(!this[0]) return;
        var defaults={
            maxLength: 140
        }
        var opts=$.extend({}, defaults, option);
        var $this=$(this);
        function detectLength(){
            var $msgTxt=$this.find(".msgTxt");
            autoHeight.call($msgTxt[0]);
            var val=$msgTxt.val().trim();
            var length=val.length;
            var i, total=0;
            for(i=0;i<length;i++){
                total+=val.charCodeAt(i)>255?1:0.5;
            }
            var left=Math.floor(opts.maxLength-total);
            var btn=$this.find(".msgSend input:submit");
            var msgTips=$this.find(".msgSend strong");
            if(left<0){
                msgTips.addClass("red");
                btn.attr("disabled","disabled")
                    .addClass("disabled");
            }else{
                msgTips.removeClass("red");
                btn.removeAttr("disabled")
                    .removeClass("disabled");
                if(left===defaults.maxLength){
                    btn.addClass("disabled");
                }
            }
            msgTips.text(left).attr("data-msg-length", total);
        };
        $this.delegate(".msgTxt","input", detectLength);
        if(window.VBArray && window.addEventListener){
            $this.delegate(".msgTxt","keyup", function(e){
                var key=e.keyCode;
                (key==8||key==46)&&detectLength();
            })
            $this.delegate(".msgTxt","cut", detectLength);
        }
    }

    $.fn.msgBoxEvent=function(){
        if(!this[0]) return;
        var updatePhoto=[];
        /*var _this=$(this);*/
        var _this=this;
        _this.msgTxtDetect();
        _this.delegate(".emojiSet","click", function (e) {
            var target=e.target;
            if(target.tagName.toLowerCase()==="a"){
                var $msgTxt=_this.find(".msgTxt");
                var msg=$msgTxt.val();
                $msgTxt.val(msg+"["+target.parentNode.title+"]")
                    .trigger("input");
            }
        });
        _this.delegate(".msgPhotoAdd","change",function(){
            var $this=$(this);
            var file=this.files[0];
            var url=createObjectURL(file);
            if(file.size/1024>=10240){
                alert("文件大小不能大于10m");
                return;
            }else if(updatePhoto.length==9){
                alert("图片数量不能超过9张");
                return;
            }
            var imgY=new Image();
            imgY.onload=function(){
                var $img=$("<img />",{"src": url});
                var $div=$("<div></div>");
                $div.append($img);
                var $icon=$("<span></span>",{class: "msgPhotoDel"});
                $div.append($icon);
                _this.find(".msgPhotoShow").append($div);
                $img.clipImg();
                updatePhoto.push(file);
                $this.val("");
                _this.find(".msgPhotoShow").height(Math.ceil(updatePhoto.length/5)*116);
            };
            imgY.src=url;
        });
        _this.delegate(".msgPhotoShow","click",function(e){
            var target=e.target;
            if(target.className==="msgPhotoDel"){
                var $msgPhotoList=$(target.parentNode)[0];
                var i=$(this).find("div").index($msgPhotoList);
                $msgPhotoList.remove();
                updatePhoto.splice(i,1);
                $(this).height(Math.ceil(updatePhoto.length/5)*116);
            }
        });
        _this.delegate(".msgSend input:submit","click",function () {
            var msgLength=_this.find(".msgSend strong").data("msg-length");
            if(msgLength>0&&msgLength<=140){
                var msg=_this.find(".msgTxt").val().trim();
                msg=msg.replace(/\n/g," ");
                var formData=new FormData();
                msg=FilterXSS(msg);
                formData.append("message", msg);
                updatePhoto.forEach(function(value, index){
                    formData.append("photo"+index, value);
                });
                /* ajax上传如果成功则将msgTxt清 */
                $.ajax({
                    type: "post",
                    url: "",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function () {
                        updatePhoto=null;
                        _this.find(".msgPhotoShow").empty().height(0);
                        _this.find(".msgTxt").val("");
                    },
                    error: function () {

                    }
                })
            }
        });
    }
    function autoHeight() {
        var $other=$(this).parent().find(".autoHeightClone");
        if($other.length<=0){
            $other=$(this).clone();
            $other.addClass("autoHeightClone")
                .appendTo($(this).parent());
            $other.css({
                "min-height": 0,
                "height": 0,
                "visibility": "hidden",
                "position":"absolute",
                "width": $(this).outerWidth(),
                "top": 0
            });
        }
        $other.val(this.value);
        $(this).innerHeight($other[0].scrollHeight);
    }
    $.fn.centerImg=function () {
        if(!this[0]) return;
        var imgW=this[0].naturalWidth;
        var constW=this.parent().width();
        this.css("width", imgW>constW?constW:imgW);
    }
    function createCommentTotal() {
        var $commentTotal=$("<div class='commentTotal'></div>");
        $("<ul class='commentList'></ul>").appendTo($commentTotal);
        return $commentTotal;
    }
    function createCommentList() {
        var info={
            "userName": "空想的萌萌猫",
            "userLink": "#",
            "userHead": "./imgs/head.png",
            "context": "把情懷和做事分開對別人也多了幾分尊重和坦誠對事情就多了幾分認真和認命",
            "commentTime": "16:45",
        };
        var $commentList=$("<li></li>");
        $("<div class='commentMsg clearfix'>" +
            "<a href='"+info.userLink+"'>"+info.userName+
            "<img src='"+info.userHead+"' title='"+info.userName+"'></a>：" +
                info.context+
            "</div>")
            .appendTo($commentList);
        $("<div class='commentFooter'>" +
            "<span>" + info.commentTime+ "</span>" +
            "</div>")
            .appendTo($commentList);
        return $commentList;
    }
    $.fn.commentBoxEvent=function () {
        if(!this[0]) return;
        var _this=this;
        var $content=_this.parent();
        _this.delegate(".msgListPhoto", "click", function (e) {
            var $this=$(this);
            function createMsgListPhotoShow() {
                var $msgListPhotoShow=$("<ul class='msgListPhotoShow clearfix'></ul>");
                $this.find("li img").each(function () {
                    $("<li class='li_small'><img src='"+this.src+"'></li>")
                        .appendTo($msgListPhotoShow);
                });
                return $msgListPhotoShow;
            }
            var $target=$(e.target);
            if($target.is("li")) $target=$target.find("img");
            if($target.is("img")){
                var index=$target.parent().index();
                var bps=_this.find(".big_photo_show");
                var mlps=_this.find(".msgListPhotoShow");
                $this.hide();
                var flag=1;
                if(bps.length<=0){
                    bps=$("<div class='big_photo_show'><img src=''></div>");
                    bps.insertAfter(_this.find(".msgListPhoto"));
                    if($this.find("li img").length>1){
                        mlps=createMsgListPhotoShow();
                        mlps.insertAfter(bps);
                        flag=0;
                    }
                }
                bps.show()
                    .find("img")
                    .attr("src", $target.attr("src"))
                    .centerImg();
                if($this.find("li img").length>1) {
                    mlps.show()
                        .find("li").eq(index).addClass("selected")
                        .siblings().removeClass("selected");
                    flag || mlps.find("img").each(function () {
                        $(this).clipImg();
                    });
                }
                $content.scrollTop($content.scrollTop()+bps.offset().top-36);
            }
        });
        _this.delegate(".big_photo_show","click",function () {
            $(this).hide();
            _this.find(".msgListPhotoShow").hide();
            _this.find(".msgListPhoto").show();
            $content.scrollTop($content.scrollTop()+_this.offset().top - 34);
        });
        _this.delegate(".msgListPhotoShow","click", function (e) {
            var $target=$(e.target);
            if($target.is("img")){
                var $li=$target.parent();
                $li.addClass("selected")
                    .siblings().removeClass("selected");
                _this.find(".big_photo_show img").attr({
                    "src": e.target.src})
                    .centerImg();
                $content.scrollTop($content.scrollTop()+_this.offset().top+
                _this.outerHeight()-$content.outerHeight() - 34);
            }
        });
        _this.delegate(".msgComment", "click", function () {
                var $commentTotal=_this.find(".commentTotal");
                if($commentTotal.length==0){
                    $commentTotal=createCommentTotal();
                    for(var i=0;i<5;i++){
                        var $li=createCommentList();
                        $li.appendTo($commentTotal.find(".commentList"));
                    }
                    $commentTotal.appendTo(_this);
                }else {
                    $commentTotal.fadeToggle();
                }
                $(this).find("b").fadeToggle();
                /*ask for comment*/
                $.ajax({
                    success: function () {
                        /*var $li=createCommentList();
                        $li.appendTo($commentTotal.find(".commentList"));*/
                    }
                });
            });
        _this.delegate(".msgOperate", "click", function () {
            $content.off("scroll", floatBtn);
            $content=_this.parent();
            if($content.hasClass("contentBox")){
                $(this).text("取消热门");
                $content=$content.parent().siblings().find(".contentHot").eq(0)
            }else {
                $(this).text("设为热门");
                $content=$content.parent().siblings().find(".contentBox").eq(0)
            }
            $(this).parent().prependTo($content);
            $content.on("scroll", floatBtn);
        });
        var $msgListBody=_this.find(".msgListBody").eq(0);
        var $pull=null;
        var $msgListBodyDemo=null;
        _this.delegate(".msgListBodyDemo a", "click", function () {
            $msgListBodyDemo=$(this).parent();
            $pull=$msgListBody.find("a.pull").eq(0);
            $msgListBody.fadeIn();
            $msgListBodyDemo.hide();
        });
        _this.delegate(".msgListBody a.pull", "click", function () {
            $msgListBody.hide();
            $msgListBodyDemo.fadeIn();
            console.log($content);
            $content.scrollTop($content.scrollTop()+_this.offset().top-30);
        });
        var $listImg=_this.find(".msgListPhoto img");
        if($listImg.length>1) {
            $listImg.on("load",function () {
                $(this).clipImg();
            });
        }
        _this.ready(function () {
            if($msgListBody.height()>200) {
                $msgListBody.hide();
                var $pull = $("<a href='javascript:;' class='pull'>收起</a>");
                $msgListBody.append($pull);
                var $spread = $("<a href='javascript:;'>展开</a>");
                var $msgListBodyDemo = $("<div class='msgListBodyDemo clearfix'></div>");
                var $img = $msgListBody.find("img");
                var $imgDemo = "";
                if ($img.length > 0) {
                    $imgDemo = "<div><img src='" + $img[0].src + "' /></div>";
                }
                $msgListBodyDemo.html($imgDemo + info.msgTitle +
                    $(info.msgInfo).text().substring(0, 100) + "...")
                    .append($spread).insertAfter($msgListBody);
                $msgListBodyDemo.find("img").on("load",function () {
                    $(this).clipImg();
                });
            }
            $content = _this.parent();
            $content.on("scroll", floatBtn);
        });
        function floatBtn() {
            if(!$msgListBodyDemo) return;
            if ($msgListBodyDemo.is(":hidden") &&
                (_this.offset().top + _this.outerHeight() >
                $content.offset().top + $content.height()) &&
                (_this.offset().top < $content.offset().top)) {
                $pull.addClass("msgPull");
                $pull.css({
                    "left": _this.offset().left + _this.outerWidth() - 70
                });
            } else {
                $pull.removeClass("msgPull");
            }
        }
    }
    function createMsgList(info){
        var $msgListContentBox=$("<div class='msgListContentBox clearfix' data-msg-type='"+info.type+"'></div>")
        $("<div class='msgOperate'>"+info.msgOperate+"</div>").appendTo($msgListContentBox);
        var $msgListContent=$("<div class='msgListContent'></div>");
        $("<div class='msgListUserInfo'>" +
            "<a href='"+info.userLink+"'>" +
            "<img src='"+info.userHead+"' class='msgListUserHead'/>" +
            "<strong class='msgListUserName'>"+info.userName+"</strong>"+
            "</a>" +
            "<a href='javascript:;' class='msgListTime'>"+info.msgListTime+"</a>" +
            "</div>").appendTo($msgListContent);
        var $msgListBody=$("<div class='msgListBody'>"+info.msgInfo+"</div>");
        $msgListBody.appendTo($msgListContent);
        if(info.type=="msgList"){
            var $msgListPhoto=$("<ul class='msgListPhoto clearfix'></ul>");
            for(var i=0;i<info.msgPhotoNum;i++){
                var $msgPhoto=$("<img src='"+info.msgPhoto[i]+"'>"), liClass;
                if(info.msgPhotoNum==1){
                    $msgPhoto.on("load", function () {
                        var c=this.naturalHeight>this.naturalWidth?"1_h":"1_w";
                        this.parentNode.className="li_"+c;
                    });
                }else{
                    liClass=info.msgPhotoNum+"_"+(i+1);
                }
                $("<li class='li_"+liClass+"'></li>")
                    .append($msgPhoto)
                    .appendTo($msgListPhoto);
            };
            $msgListPhoto.appendTo($msgListContent);
            $("<ul class='msgListFooter clearfix'>" +
                "<li class='msgLike'><i>&nbsp;</i><span>"+info.msgLike+"</span></li>" +
                "<li class='msgComment'><i>&nbsp;</i><span>"+info.msgComment+"</span><b></b></li></ul>")
                .appendTo($msgListContent);
        }
        if(info.type==="article") {
            $msgListBody.html(info.msgTitle + $msgListBody.html());
            $("<ul class='msgListFooter clearfix'>" +
                "<li class='msgLike'><i>&nbsp;</i><span>" + info.msgLike + "</span></li>" +
                "<li class='msgComment'><i>&nbsp;</i><span>" + info.msgComment + "</span><b></b></li></ul>")
                .appendTo($msgListContent);
        }
        $msgListContent.appendTo($msgListContentBox);
        return $msgListContentBox;
    }
    var time=7;
    for(var i=0;i<7;i++){
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
                "./imgs/2.jpg",
                "./imgs/3.jpg",
                "./imgs/1.jpg",
                "./imgs/3.jpg"
            ],
            msgLike: 66,
            msgComment: 6,
            msgOperate: "设为热门"
        };
        info.msgPhotoNum=time;
         m = createMsgList(info);
         m.commentBoxEvent();
         m.appendTo($('.contentBox').eq(0));
        info.msgInfo='<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白' +
            '<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span>' +
            '<font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><a href="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg" target="_blank"><img src="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg"></a><p>' +
            '<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span><font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><p>';
        info.type="article";
        info.msgInfo+=info.msgInfo;
        m=createMsgList(info);
        m.commentBoxEvent();
        m.appendTo($('.contentBox'));
    }
    for(var i=0;i<7;i++){
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
                "./imgs/2.jpg",
                "./imgs/3.jpg",
                "./imgs/1.jpg",
                "./imgs/3.jpg"
            ],
            msgLike: 66,
            msgComment: 6,
            msgOperate: "取消热门"
        };
        info.msgPhotoNum=time;
        m = createMsgList(info);
        m.commentBoxEvent();
        m.appendTo($('.contentHot').eq(0));
        info.msgInfo='<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白' +
            '<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span>' +
            '<font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><a href="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg" target="_blank"><img src="http://localhost:8090/WebstormProjects/weibo-alpha/imgs/1.jpg"></a><p>' +
            '<p><b>图一是我之前推荐给</b>你们的，帮你们代购的黑BA防晒霜获得日本各种大奖，后面几张都是POLA的明星产品美白丸和抗糖丸，专柜经常是断货状态，很</p><p>难买到<strike>，我自己这次在日本</strike><i><strike>也买</strike>了美白<font color="#ff0000">丸和抗糖丸。不加代购费！不加任</font></i><font color="#ff0000">何</font>国际运费！<a href="1" target="_blank">还是专柜退完税的</a>价</p><p><ul><li><span style="font-size: 14px; line-height: 1.8;">格帮你们代购[可</span><font face="Times New Roman" style="font-style: inherit; font-variant: inherit; font-weight: inherit;">爱]有需要的妞请联</font><span style="font-size: 14px; line-height: 1.8;">系店铺客服拍，.</span><br></li></ul></p><p>';
        info.type="article";
        info.msgInfo+=info.msgInfo;
        m=createMsgList(info);
        m.commentBoxEvent();
        m.appendTo($('.contentHot').eq(0));
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
    function alertMsg(tips, $relative, type) {
        var src="./imgs/icon/success.png";
        if(type=="error") src="./imgs/icon/error.png";
        var $tips= $("<div class='tips'></div>");
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
})();